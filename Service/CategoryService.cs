using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Dtos;
using DataType = LinqToDB.DataType;

namespace Infra;

public class CategoryService(MyDatabaseConnection db)
{
    public List<CategoryDto> GetAll()
    {
        return db.Categories.ToList().Select(c => new CategoryDto(c)).ToList();
    }

    public CategoryDto Create(CreateCategoryRequestDto dto)
    {
        var name = dto.CategoryName?.Trim();
        if (string.IsNullOrWhiteSpace(name)) throw new ValidationException("Category name is required");
        if (db.Categories.Any(c => c.CategoryName.ToLower() == name.ToLower())) 
            throw new ValidationException("Category name already exists");
        var category = new Category
        {
            CategoryId = Guid.NewGuid().ToString(),
            CategoryName = name,
            Description = dto.Description
        };
        db.Insert(category);
        return new CategoryDto(category);
    }

    public void Update(UpdateCategoryRequestDto dto)
    {
        var category = db.Categories.FirstOrDefault(c => c.CategoryId == dto.CategoryIdForLookup)
                       ?? throw new ValidationException("Category not found");
        if (dto.NewName != null)
        {
            var name = dto.NewName.Trim();
            if (name.Length == 0) throw new ValidationException("Category name is required");
            if (db.Categories.Any(c => c.CategoryId != category.CategoryId && c.CategoryName.ToLower() == name.ToLower()))
                throw new ValidationException("Category name already exists");
            category.CategoryName = name;
        }
        if (dto.NewDescription != null)
            category.Description = dto.NewDescription;
        db.Update(category);
    }

    public void Delete(string categoryId)
    {
        var category = db.Categories.FirstOrDefault(c => c.CategoryId == categoryId) ??
                       throw new ValidationException("The category doesn't exist");
        //TODO block or reassigning products in this category when deleting
        db.Delete(category);
    }
}