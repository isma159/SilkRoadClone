using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;
using Service.Dtos;

namespace Service;

public class OrderService(MyDatabaseConnection db)
{
    public List<OrderDto> GetAll() => db.Orders.ToList().Select(o => new OrderDto(o)).ToList();

    public OrderDto Create(CreateOrderRequestDto dto)
    {
        if (dto.Quantity <= 0)
            throw new ValidationException("Quantity must be positive.");

        var product = db.Products.FirstOrDefault(p => p.Id == dto.ProductId && p.IsActive)
                      ?? throw new KeyNotFoundException("Product not found.");

        if (product.Stock < dto.Quantity)
            throw new ValidationException("Not enough stock.");

        product.Stock -= dto.Quantity;
        db.Update(product);

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
        return new OrderDto(order);
    }
}