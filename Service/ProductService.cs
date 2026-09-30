using System.ComponentModel.DataAnnotations;
using Infra;
using LinqToDB;
using Service.Dtos;

namespace Service;
public class ProductService(MyDatabaseConnection db)
{
    public List<ProductResponse> GetAll(string? categoryId, string? search)
    {
        var query = db.Products.Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(categoryId))
            query = query.Where(p => p.CategoryId == categoryId);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Title.Contains(search));

        return query.ToList().Select(ToResponse).ToList();
    }

    public ProductResponse GetById(string id)
    {
        var product = db.Products.FirstOrDefault(p => p.Id == id && p.IsActive)
                      ?? throw new KeyNotFoundException();
        return ToResponse(product);
    }

    public ProductResponse Create(ProductCreateRequest request)
    {
        Validate(request.Title, request.PriceDkk, request.Stock);

        var product = new Product
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            Description = request.Description,
            PriceDkk = request.PriceDkk,
            Stock = request.Stock,
            ShipsFrom = request.ShipsFrom,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            VendorId = "test-vendor", // erstattes med den indloggede bruger
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        db.Insert(product);
        return ToResponse(product);
    }

    public ProductResponse Update(ProductUpdateRequest request)
    {
        var product = db.Products.FirstOrDefault(p => p.Id == request.Id && p.IsActive)
                      ?? throw new KeyNotFoundException();

        if (request.Title != null)
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                throw new ValidationException("Title is required.");
            product.Title = request.Title;
        }
        if (request.PriceDkk != null)
        {
            if (request.PriceDkk < 0)
                throw new ValidationException("Price cannot be negative.");
            product.PriceDkk = request.PriceDkk.Value;
        }
        if (request.Stock != null)
        {
            if (request.Stock < 0)
                throw new ValidationException("Stock cannot be negative.");
            product.Stock = request.Stock.Value;
        }
        if (request.Description != null) product.Description = request.Description;
        if (request.ShipsFrom != null) product.ShipsFrom = request.ShipsFrom;
        if (request.ImageUrl != null) product.ImageUrl = request.ImageUrl;
        if (request.CategoryId != null) product.CategoryId = request.CategoryId;

        db.Update(product);
        return ToResponse(product);
    }

    public void Delete(string id)
    {
        var product = db.Products.FirstOrDefault(p => p.Id == id && p.IsActive)
                      ?? throw new KeyNotFoundException();
        product.IsActive = false;
        db.Update(product);
    }

    private static void Validate(string title, decimal price, int stock)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Title is required.");
        if (price < 0)
            throw new ValidationException("Price cannot be negative.");
        if (stock < 0)
            throw new ValidationException("Stock cannot be negative.");
    }

    private static ProductResponse ToResponse(Product p) => new(
        p.Id, p.Title, p.Description, p.PriceDkk, p.Stock, p.ShipsFrom,
        p.ImageUrl, p.CategoryId, p.VendorId, p.IsActive, p.CreatedAtUtc);
}