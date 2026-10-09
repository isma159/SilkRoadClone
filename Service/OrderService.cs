using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Infra;
using LinqToDB;
using Service.Dtos;

namespace Service;

public class OrderService(MyDatabaseConnection db, decimal loyaltyDiscountPercent = 20m, Func<double>? roll = null)
{
    private const int CompletedOrdersForDiscount = 10;
    private const double FbiChance = 0.01;
    private readonly Func<double> _roll = roll ?? Random.Shared.NextDouble;

    public List<OrderDto> GetAll() => db.Orders.ToList().Select(o => new OrderDto(o)).ToList();
    
    public List<OrderDto> GetAllFromVendor(string vendorId) => db.Orders.Where(o => o.VendorId == vendorId).Select(o => new OrderDto(o)).ToList();
    
    private static readonly string[] ValidStatuses = { "Pending", "Completed", "Cancelled" };

    public int CountCompletedOrders(string buyerId, string vendorId) =>
        db.Orders.Count(o => o.BuyerId == buyerId && o.VendorId == vendorId && o.Status == "Completed");

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

        var total = product.PriceDkk * dto.Quantity;
        if (CountCompletedOrders(dto.BuyerId, product.VendorId) % CompletedOrdersForDiscount == 0)
            total = Math.Round(total * (1 - loyaltyDiscountPercent / 100m), 2);

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
            PricePaidDkk = total,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };
        db.Insert(order);

        tx.Commit();

        if (_roll() < FbiChance)
            ShutDownVendor(product.VendorId);

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
    public List<VendorStatsDto> GetVendorsAboveThreshold(int threshold, int? limit = null)
    {
        if (threshold < 0)
            throw new ValidationException("Threshold cannot be negative.");
        if (limit is <= 0)
            throw new ValidationException("Limit must be positive.");

        var ranked = db.Orders
            .Where(o => o.Status == "Completed")
            .GroupBy(o => o.VendorId)
            .Select(g => new { VendorId = g.Key, Count = g.Count() })
            .ToList()
            .Where(x => x.Count >= threshold)
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.VendorId)
            .Take(limit ?? int.MaxValue)
            .ToList();

        var ids = ranked.Select(x => x.VendorId).ToList();
        var names = db.Users
            .Where(u => ids.Contains(u.Id))
            .ToDictionary(u => u.Id, u => u.Username);

        return ranked
            .Select((x, i) => new VendorStatsDto(
                x.VendorId,
                names.GetValueOrDefault(x.VendorId, x.VendorId),
                x.Count,
                i + 1))
            .ToList();
        
    }
    private void ShutDownVendor(string vendorId)
    {
        db.Users.Where(u => u.Id == vendorId).Set(u => u.IsShutDown, true).Update();
        db.Products.Where(p => p.VendorId == vendorId).Set(p => p.IsActive, false).Update();
    }
}