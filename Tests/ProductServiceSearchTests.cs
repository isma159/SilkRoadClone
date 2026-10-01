
using LinqToDB;
using Infra;
using Microsoft.Data.Sqlite;
using Service;
using Service.Dtos;

namespace Tests;

public class ProductServiceSearchTests : IDisposable
{
    private readonly string _file = $"test-{Guid.NewGuid()}.db";
    private readonly MyDatabaseConnection _db;
    private readonly ProductService _service;

    public ProductServiceSearchTests()
    {
        var options = new DataOptions().UseSQLite($"Data Source={_file}");
        _db = new MyDatabaseConnection(new DataOptions<MyDatabaseConnection>(options));
        _db.CreateTable<Product>();
        _service = new ProductService(_db);

        _db.Insert(new Product
        {
            Id = "1", Title = "Blue Powder", Description = "premium stuff", PriceDkk = 500, Stock = 10,
            CategoryId = "cat-drugs", VendorId = "v1", IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
        _db.Insert(new Product
        {
            Id = "2", Title = "White Powder", Description = "cheap batch", PriceDkk = 150, Stock = 25,
            CategoryId = "cat-drugs", VendorId = "v1", IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
        _db.Insert(new Product
        {
            Id = "3", Title = "Rusty Pistol", Description = "dont shoot yourself", PriceDkk = 2000, Stock = 4,
            CategoryId = "cat-weapons", VendorId = "v1", IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
        _db.Insert(new Product
        {
            Id = "4", Title = "Busted Listing", Description = "dont show anyone", PriceDkk = 5, Stock = 2,
            CategoryId = "cat-weapons", VendorId = "v1", IsActive = false, CreatedAtUtc = DateTime.UtcNow
        });
    }

    public void Dispose()
    {
        _db.Dispose();
        Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
        File.Delete(_file);
    }

    [Fact]
    public void SearchByCategoryReturnOnlyThatCategory()
    {
        var results = _service.Search(new ProductSearchDto { CategoryId = "cat-drugs" });
        Assert.Equal(2, results.Count);
    }
    
    [Fact]
    public void SearchByPriceRangeReturnOnlyThatCategory()
    {
        var results = _service.Search(new ProductSearchDto { MinPriceDkk = 300, MaxPriceDkk = 1000});
        Assert.Single(results);
        Assert.Equal("Blue Powder", results[0].Title);
    }
    
    [Fact]
    public void SearchByKeyWordIsCaseInsensitive()
    {
        var results = _service.Search(new ProductSearchDto { Keyword = "PoWdEr" });
        Assert.Equal(2, results.Count);
    }

    [Fact]
    public void SearchMinGreaterThanMaxThrows()
    {
        Assert.Throws<System.ComponentModel.DataAnnotations.ValidationException>(() =>
            _service.Search(new ProductSearchDto { MinPriceDkk = 100, MaxPriceDkk = 99 }));
    }

    [Fact]
    public void SearchNoFiltersReturnsAllActive()
    {
        var results = _service.Search(new ProductSearchDto());
        Assert.Equal(3, results.Count);
    }
}