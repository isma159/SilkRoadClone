using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Infra;
using LinqToDB;
using Service.Dtos;

namespace Service;

public class OrderService(MyDatabaseConnection db)
{
    public List<OrderDto> GetAll() => db.Orders.ToList().Select(o => new OrderDto(o)).ToList();
    
    private static readonly string[] ValidStatuses = { "Pending", "Completed", "Cancelled" };

    public OrderDto Create(CreateOrderRequestDto dto)
    {
        if (dto.Quantity <= 0)
            throw new ValidationException("Quantity must be positive.");

        if (!db.Users.Any(u => u.Id == dto.BuyerId))
            throw new KeyNotFoundException("Buyer not found.");

        var product = db.Products.FirstOrDefault(p => p.Id == dto.ProductId && p.IsActive)
                      ?? throw new KeyNotFoundException("Product not found.");

        if (product.VendorId == dto.BuyerId)
            throw new ValidationException("You cannot buy your own product.");

        using var tx = db.BeginTransaction();

        var updated = db.Products
            .Where(p => p.Id == product.Id && p.Stock >= dto.Quantity)
            .Set(p => p.Stock, p => p.Stock - dto.Quantity)
            .Update();
        if (updated == 0)
            throw new ValidationException("Not enough stock.");

        var order = new Order
        {
            Id = Guid.NewGuid().ToString(),
            BuyerId = dto.BuyerId,
            VendorId = product.VendorId,
            ProductId = product.Id,
            Quantity = dto.Quantity,
            PricePaidDkk = product.PriceDkk * dto.Quantity,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow
        };
        db.Insert(order);

        tx.Commit();
        return new OrderDto(order);
    }
    public OrderDto UpdateStatus(UpdateOrderStatusRequestDto dto)
    {
        if (!ValidStatuses.Contains(dto.Status))
            throw new ValidationException("Invalid status.");

        var order = db.Orders.FirstOrDefault(o => o.Id == dto.OrderId)
                    ?? throw new KeyNotFoundException("Order not found.");

        order.Status = dto.Status;
        db.Update(order);
        return new OrderDto(order);
    }
    public List<VendorStatsDto> GetVendorsAboveThreshold(int threshold)
    {
        if (threshold < 0)
            throw new ValidationException("Threshold cannot be negative.");

        return db.Orders
            .Where(o => o.Status == "Completed")
            .GroupBy(o => o.VendorId)
            .Select(g => new { VendorId = g.Key, Count = g.Count() })
            .ToList()
            .Where(x => x.Count >= threshold)
            .OrderByDescending(x => x.Count)
            .Select(x => new VendorStatsDto(x.VendorId, x.Count))
            .ToList();
    }
}

