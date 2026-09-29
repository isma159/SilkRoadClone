using LinqToDB.Mapping;

namespace Infra.Entities;

public class Category
{
    [PrimaryKey] public string CategoryId { get; set; } = "";
    [Column] public string CategoryName { get; set; } = "";
    [Column] public string? Description {get; set;}
}