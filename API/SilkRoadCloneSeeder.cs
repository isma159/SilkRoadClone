using System;
using System.Linq;
using Infra;
using Infra.Entities;
using Infra.Enums;
using LinqToDB;
 
namespace API;
 
public class SilkRoadCloneSeeder(MyDatabaseConnection db)
{
    public void Seed()
    {
        CreateTables();
        SeedCategories();
        SeedUsers();
        SeedProducts();
    }
 
    public void CreateTables()
    {
        db.CreateTable<Category>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Product>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Order>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
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
 
    public void SeedUsers()
    {
        if (db.Users.Any())
            return;
 
        db.Insert(new User
        {
            Id = Guid.NewGuid().ToString(),
            Username = "admin",
            Password = "admin123",
            Role = Roles.Admin,
            IsShutDown = false
        });
 
        string[] usernames = ["isma159", "vendor-mike", "vendor-sara"];
        foreach (var name in usernames)
        {
            db.Insert(new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = name,
                Password = "password123",
                Role = Roles.User,
                IsShutDown = false
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
        var counterfeitId = db.Categories.First(c => c.CategoryName == "Counterfeit Goods").CategoryId;
        var forgedId = db.Categories.First(c => c.CategoryName == "Forged Documents").CategoryId;
 
        var categoryIds = new[] { drugsId, weaponsId, artifactsId, counterfeitId, forgedId };
 
        var vendorUsers = db.Users.Where(u => u.Role == Roles.User).ToList();
 
        var productNames = new[]
        {
            "Blue Powder", "White Powder", "Rusty Pistol", "Ancient Vase",
            "Fake Rolex", "Forged Passport", "Sawed-off Shotgun", "Stolen Painting",
            "Counterfeit Bills"
        };
 
        var rng = new Random();
        var nameIndex = 0;
 
        foreach (var vendor in vendorUsers)
        {
            for (var i = 0; i < 3; i++)
            {
                var name = productNames[nameIndex % productNames.Length];
                nameIndex++;
 
                db.Insert(new Product
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = name,
                    Description = $"{name} — ask no questions.",
                    PriceDkk = rng.Next(50, 15000),
                    Stock = rng.Next(1, 30),
                    CategoryId = categoryIds[rng.Next(categoryIds.Length)],
                    VendorId = vendor.Id,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                });
            }
        }
    }
}