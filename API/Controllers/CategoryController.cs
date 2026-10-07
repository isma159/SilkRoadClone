using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Infra;
using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using LinqToDB;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("[controller]")]
public class CategoryController(CategoryService service, MyDatabaseConnection dbc) : ControllerBase
{
    
    [HttpGet(nameof(GetCategories))]
    public List<CategoryDto> GetCategories()
    {
        return service.GetAll();
    }

    [HttpPost(nameof(CreateCategory))]
    public CategoryDto CreateCategory(CreateCategoryRequestDto dto)
    {
        return service.Create(dto);
    }


    [HttpPut(nameof(UpdateCategory))]
    public void UpdateCategory(UpdateCategoryRequestDto dto)
    {
        service.Update(dto);
    }
   

    [HttpDelete(nameof(DeleteCategory))]
    public void DeleteCategory(string categoryId)
    {
        service.Delete(categoryId);
    }
    
}