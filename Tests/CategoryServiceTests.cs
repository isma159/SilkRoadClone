using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service;
using Service.Dtos;
using Xunit;

namespace Tests;

public class CategoryServiceTests : IDisposable
{
    private readonly MyDatabaseConnection _db;
    private readonly CategoryService _service;

    public CategoryServiceTests()
    {
        var options = new DataOptions<MyDatabaseConnection>(
            new DataOptions().UseSQLite("Data Source=:memory:"));
        _db = new MyDatabaseConnection(options);
        _db.CreateTable<Category>();
        _db.CreateTable<Product>();
        _service = new CategoryService(_db);
    }

    [Fact]
    public void Create_rejects_blank_name()
    {
        var request = new CreateCategoryRequestDto { CategoryName = "  ", Description = null };
        Assert.Throws<ValidationException>(() => _service.Create(request));
    }

    [Fact]
    public void Create_inserts_and_returns_category()
    {
        var request = new CreateCategoryRequestDto { CategoryName = "Weaponry", Description = null };

        var result = _service.Create(request);

        Assert.False(string.IsNullOrEmpty(result.CategoryId));
        Assert.Equal("Weaponry", result.CategoryName);
    }

    [Fact]
    public void Create_rejects_duplicate_name_case_insensitive()
    {
        _service.Create(new CreateCategoryRequestDto { CategoryName = "Weaponry", Description = null });

        Assert.Throws<ValidationException>(() =>
            _service.Create(new CreateCategoryRequestDto { CategoryName = "weaponry", Description = null }));
    }

    [Fact]
    public void Update_changes_only_supplied_fields()
    {
        var created = _service.Create(new CreateCategoryRequestDto { CategoryName = "Weaponry", Description = "Original" });

        _service.Update(new UpdateCategoryRequestDto
        {
            CategoryIdForLookup = created.CategoryId,
            NewName = "Renamed",
            NewDescription = null
        });

        var all = _service.GetAll();
        var updated = all.Single(c => c.CategoryId == created.CategoryId);

        Assert.Equal("Renamed", updated.CategoryName);
        Assert.Equal("Original", updated.Description);
    }

    [Fact]
    public void Update_throws_for_unknown_id()
    {
        var request = new UpdateCategoryRequestDto
        {
            CategoryIdForLookup = "unknown-id",
            NewName = "Whatever",
            NewDescription = null
        };

        Assert.Throws<ValidationException>(() => _service.Update(request));
    }

    [Fact]
    public void Delete_removes_category_from_GetAll()
    {
        var created = _service.Create(new CreateCategoryRequestDto { CategoryName = "Weaponry", Description = null });

        _service.Delete(created.CategoryId);

        Assert.DoesNotContain(_service.GetAll(), c => c.CategoryId == created.CategoryId);
    }

    [Fact]
    public void Delete_throws_for_unknown_id()
    {
        Assert.Throws<ValidationException>(() => _service.Delete("unknown-id"));
    }
    [Fact]
    public void Update_rejects_duplicate_name()
    {
        var a = _service.Create(new CreateCategoryRequestDto { CategoryName = "A" });
        _service.Create(new CreateCategoryRequestDto { CategoryName = "B" });

        Assert.Throws<ValidationException>(() =>
            _service.Update(new UpdateCategoryRequestDto { CategoryIdForLookup = a.CategoryId, NewName = "b" }));
    }

    [Fact]
    public void Delete_blocks_when_category_has_products()
    {
        var cat = _service.Create(new CreateCategoryRequestDto { CategoryName = "Weaponry" });
        _db.Insert(new Product
        {
            Id = "p1", Title = "x", CategoryId = cat.CategoryId, VendorId = "v1",
            IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });

        Assert.Throws<ValidationException>(() => _service.Delete(cat.CategoryId));
    }

    public void Dispose() => _db.Dispose();
}