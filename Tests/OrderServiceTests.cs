using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
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
        _db.CreateTable<User>();
        _db.Insert(new User { Id = "buyer-1", Username = "buyer", Password = "x" });
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
    private void SeedOrder(string vendorId, string status)
    {
        _db.Insert(new Order
        {
            Id = Guid.NewGuid().ToString(),
            BuyerId = "buyer-1",
            VendorId = vendorId,
            ProductId = "p",
            Quantity = 1,
            PricePaidDkk = 10m,
            Status = status,
            CreatedAtUtc = DateTime.UtcNow
        });
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
    [Fact]
    public void Create_throws_for_unknown_buyer()
    {
        var productId = SeedProduct();
        Assert.Throws<KeyNotFoundException>(() =>
            _service.Create(new CreateOrderRequestDto { BuyerId = "nobody", ProductId = productId, Quantity = 1 }));
    }

    [Fact]
    public void UpdateStatus_sets_status()
    {
        var productId = SeedProduct();
        var order = _service.Create(new CreateOrderRequestDto { BuyerId = "buyer-1", ProductId = productId, Quantity = 1 });

        var result = _service.UpdateStatus(new UpdateOrderStatusRequestDto { OrderId = order.Id, Status = "Completed" });

        Assert.Equal("Completed", result.Status);
    }

    [Fact]
    public void UpdateStatus_rejects_unknown_status()
    {
        Assert.Throws<ValidationException>(() =>
            _service.UpdateStatus(new UpdateOrderStatusRequestDto { OrderId = "x", Status = "Banana" }));
    }
    
    [Fact]
    public void VendorStats_counts_only_completed_orders()
    {
        SeedOrder("v1", "Completed");
        SeedOrder("v1", "Pending");
        SeedOrder("v1", "Cancelled");

        var stats = Assert.Single(_service.GetVendorsAboveThreshold(0));

        Assert.Equal(1, stats.CompletedOrderCount);
    }

    [Fact]
    public void VendorStats_filters_by_threshold()
    {
        SeedOrder("v1", "Completed");
        SeedOrder("v1", "Completed");
        SeedOrder("v1", "Completed");
        SeedOrder("v2", "Completed");

        var stats = Assert.Single(_service.GetVendorsAboveThreshold(2));

        Assert.Equal("v1", stats.VendorId);
    }

    [Fact]
    public void VendorStats_orders_by_count_descending()
    {
        SeedOrder("v2", "Completed");
        SeedOrder("v1", "Completed");
        SeedOrder("v1", "Completed");

        var result = _service.GetVendorsAboveThreshold(1);

        Assert.Equal(new[] { "v1", "v2" }, result.Select(r => r.VendorId));
    }

    [Fact]
    public void VendorStats_rejects_negative_threshold()
    {
        Assert.Throws<ValidationException>(() => _service.GetVendorsAboveThreshold(-1));
    }
    [Fact]
    public void VendorStats_breaks_ties_by_vendor_id()
    {
        SeedOrder("b", "Completed");
        SeedOrder("a", "Completed");

        var result = _service.GetVendorsAboveThreshold(1);

        Assert.Equal(new[] { "a", "b" }, result.Select(r => r.VendorId));
    }
    [Fact]
    public void VendorStats_assigns_ranks_and_respects_limit()
    {
        SeedOrder("v1", "Completed");
        SeedOrder("v1", "Completed");
        SeedOrder("v2", "Completed");
        SeedOrder("v3", "Completed");

        var result = _service.GetVendorsAboveThreshold(1, limit: 2);

        Assert.Equal(new[] { "v1", "v2" }, result.Select(r => r.VendorId));
        Assert.Equal(new[] { 1, 2 }, result.Select(r => r.Rank));
    }
    
    [Fact]
    public void VendorStats_rejects_non_positive_limit()
    {
        Assert.Throws<ValidationException>(() => _service.GetVendorsAboveThreshold(1, limit: 0));
    }
    [Fact]
    public void VendorStats_uses_username_and_falls_back_to_id()
    {
        _db.Insert(new User { Id = "v1", Username = "shopkeeper", Password = "x" });
        SeedOrder("v1", "Completed");
        SeedOrder("v1", "Completed");
        SeedOrder("v2", "Completed");

        var result = _service.GetVendorsAboveThreshold(1);

        Assert.Equal("shopkeeper", result[0].VendorName);
        Assert.Equal("v2", result[1].VendorName);
    }
    

    public void Dispose() => _db.Dispose();
}