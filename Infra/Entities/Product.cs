using LinqToDB.Mapping;

namespace Infra;
[Table("Product")]
public class Product
{
    [PrimaryKey] public string Id { get; set; } = "";

    [Column] [NotNull] public string Title { get; set; } = "";
    [Column] public string? Description { get; set; }
    [Column] public decimal PriceDkk { get; set; }
    [Column] public int Stock { get; set; }
    [Column] public string? ShipsFrom { get; set; }
    [Column] public string? ImageUrl { get; set; }
    [Column] [NotNull] public string CategoryId { get; set; } = "";
    [Column] [NotNull] public string VendorId { get; set; } = "";
    [Column] public bool IsActive { get; set; } = true;
    [Column] public DateTime CreatedAtUtc { get; set; }
    
}