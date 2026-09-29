using Facet;
using System.ComponentModel.DataAnnotations;
using Infra.Entities;

namespace Service.Dtos;

[Facet(typeof(Category))]
public partial class CategoryDto;

public class CreateCategoryRequestDto
{
    public string CategoryName { get; set; } = "";
    public string? Description { get; set; } 
}

public class UpdateCategoryRequestDto
{
    [MinLength(1)] public string CategoryIdForLookup { get; set; } = "";
    public string? NewName { get; set; }
    public string? NewDescription { get; set; }
}