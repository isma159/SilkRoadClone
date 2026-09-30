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
}