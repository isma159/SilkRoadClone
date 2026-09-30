using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;
using Service;
using Service.Dtos;
using Xunit;

namespace Tests;

public class OrderServiceTests : IDisposable
{
    private readonly MyDatabaseConnection _db;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        var options = new DataOptions<MyDatabaseConnection>(
            new DataOptions().UseSQLite("Data Source=:memory:"));
        _db = new MyDatabaseConnection(options);
        _db.CreateTable<Product>();
        _db.CreateTable<Order>();
        _service = new OrderService(_db);
    }

    private string SeedProduct(int stock = 10, decimal price = 50m)
    {
        var product = new Product
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Test product",
            PriceDkk = price,
            Stock = stock,
            CategoryId = "cat-1",
            VendorId = "vendor-1",
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.Insert(product);
        return product.Id;
    }

    [Fact]
    public void Create_rejects_zero_quantity()
    {
        var productId = SeedProduct();
        var request = new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 0 };

        Assert.Throws<ValidationException>(() => _service.Create(request));
    }

    [Fact]
    public void Create_rejects_negative_quantity()
    {
        var productId = SeedProduct();
        var request = new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = -1 };

        Assert.Throws<ValidationException>(() => _service.Create(request));
    }

    [Fact]
    public void Create_rejects_when_not_enough_stock()
    {
        var productId = SeedProduct(stock: 5);
        var request = new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 6 };

        Assert.Throws<ValidationException>(() => _service.Create(request));
    }

    [Fact]
    public void Create_allows_exact_remaining_stock()
    {
        var productId = SeedProduct(stock: 5);
        var request = new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 5 };

        var result = _service.Create(request);

        Assert.False(string.IsNullOrEmpty(result.Id));
    }

    [Fact]
    public void Create_throws_for_unknown_product()
    {
        var request = new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = "unknown-id", Quantity = 1 };

        Assert.Throws<KeyNotFoundException>(() => _service.Create(request));
    }

    [Fact]
    public void Create_decrements_product_stock()
    {
        var productId = SeedProduct(stock: 10);
        _service.Create(new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 3 });

        var product = _db.Products.First(p => p.Id == productId);
        Assert.Equal(7, product.Stock);
    }

    [Fact]
    public void Create_sets_price_paid_from_product_price_times_quantity()
    {
        var productId = SeedProduct(stock: 10, price: 25m);
        var result = _service.Create(new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 4 });

        Assert.Equal(100m, result.PricePaidDkk);
    }

    [Fact]
    public void Create_sets_status_to_pending()
    {
        var productId = SeedProduct();
        var result = _service.Create(new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 1 });

        Assert.Equal("Pending", result.Status);
    }

    [Fact]
    public void Create_copies_vendor_id_from_product()
    {
        var productId = SeedProduct();
        var result = _service.Create(new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 1 });

        Assert.Equal("vendor-1", result.VendorId);
    }

    public void Dispose() => _db.Dispose();
}