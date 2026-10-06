using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;
using Service;
using Service.Dtos;
using Xunit;
using Infra.Entities;

namespace Tests;

public class ProductServiceTests : IDisposable
{
    private readonly MyDatabaseConnection _db;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        var options = new DataOptions<MyDatabaseConnection>(
            new DataOptions().UseSQLite("Data Source=:memory:"));
        _db = new MyDatabaseConnection(options);
        _db.CreateTable<Product>();
        _db.CreateTable<Category>();
        _db.CreateTable<User>();
        _db.Insert(new Category { CategoryId = "1", CategoryName = "Test" });
        _service = new ProductService(_db);
    }

    [Fact]
    public void Create_rejects_negative_price()
    {
        var request = new ProductCreateRequest("Test", null, -1m, 10, null, null, "1", null);
        Assert.Throws<ValidationException>(() => _service.Create(request));
    }

    [Fact]
    public void Create_inserts_and_returns_product()
    {
        var request = new ProductCreateRequest("Test", null, 99m, 10, null, null, "1", null);
        var result = _service.Create(request);

        Assert.False(string.IsNullOrEmpty(result.Id));
        Assert.Equal("Test", result.Title);
    }

    [Fact]
    public void Delete_hides_product_so_GetById_throws()
    {
        var created = _service.Create(new ProductCreateRequest("Test", null, 99m, 10, null, null, "1", null));
        _service.Delete(created.Id);

        Assert.Throws<KeyNotFoundException>(() => _service.GetById(created.Id));
    }
    [Fact]
    public void Create_rejects_unknown_category()
    {
        var request = new ProductCreateRequest("Test", null, 99m, 10, null, null, "missing", null);
        Assert.Throws<ValidationException>(() => _service.Create(request));
    }

    [Fact]
    public void Update_changes_only_supplied_fields()
    {
        var created = _service.Create(new ProductCreateRequest("Test", "Desc", 99m, 10, null, null, "1", null));

        var result = _service.Update(new ProductUpdateRequest { Id = created.Id, Title = "Renamed" });

        Assert.Equal("Renamed", result.Title);
        Assert.Equal("Desc", result.Description);
    }

    public void Dispose() => _db.Dispose();
}
