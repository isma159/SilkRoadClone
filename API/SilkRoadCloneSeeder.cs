using System;
using System.Linq;
using Infra;
using Infra.Entities;
using LinqToDB;

namespace API;

public class SilkRoadCloneSeeder(MyDatabaseConnection db)
{
    public void Seed()
    {
        CreateTables();
        SeedCategories();
        SeedProducts();
    }

    public void CreateTables()
    {
        db.CreateTable<Category>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Product>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Order>(tableOptions: TableOptions.CreateIfNotExists);
    }

    public void SeedCategories()
    {
        if (db.Categories.Any())
            return;
        string[] names = ["Drugs", "Weaponry", "Stolen Artifacts", "Counterfeit Goods", "Forged Documents"];
        foreach (var name in names)
        {
            db.Insert(new Category
            {
                CategoryId = Guid.NewGuid().ToString(),
                CategoryName = name,
                Description = $"Listings related to {name.ToLower()}."
            });
        }
    }
    
    public void SeedProducts()
    {
        if (db.Products.Any())
            return;

        var drugsId = db.Categories.First(c => c.CategoryName == "Drugs").CategoryId;
        var weaponsId = db.Categories.First(c => c.CategoryName == "Weaponry").CategoryId;
        var artifactsId = db.Categories.First(c => c.CategoryName == "Stolen Artifacts").CategoryId;

        db.Insert(new Product
        {
            Id = Guid.NewGuid().ToString(), Title = "Blue Powder", Description = "premium stuff",
            PriceDkk = 500, Stock = 10, CategoryId = drugsId, VendorId = "seed-vendor-1",
            IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
        db.Insert(new Product
        {
            Id = Guid.NewGuid().ToString(), Title = "White Powder", Description = "cheap batch",
            PriceDkk = 150, Stock = 25, CategoryId = drugsId, VendorId = "seed-vendor-2",
            IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
        db.Insert(new Product
        {
            Id = Guid.NewGuid().ToString(), Title = "Rusty Pistol", Description = "fires ok, mostly",
            PriceDkk = 2000, Stock = 3, CategoryId = weaponsId, VendorId = "seed-vendor-1",
            IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
        db.Insert(new Product
        {
            Id = Guid.NewGuid().ToString(), Title = "Ancient Vase", Description = "definitely not stolen",
            PriceDkk = 12000, Stock = 1, CategoryId = artifactsId, VendorId = "seed-vendor-2",
            IsActive = true, CreatedAtUtc = DateTime.UtcNow
        });
    }
}