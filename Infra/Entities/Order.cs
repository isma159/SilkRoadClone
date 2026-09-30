using LinqToDB.Mapping;

namespace Infra;

[Table("Order")]
public class Order
{
    [PrimaryKey] public string Id { get; set; } = "";
    [Column] [NotNull] public string BuyerId { get; set; } = "";
    [Column] [NotNull] public string VendorId { get; set; } = "";
    [Column] [NotNull] public string ProductId { get; set; } = "";
    [Column] public int Quantity { get; set; }
    [Column] public decimal PricePaidDkk { get; set; }
    [Column] [NotNull] public string Status { get; set; } = "Pending";
    [Column] public DateTime CreatedAtUtc { get; set; }
}