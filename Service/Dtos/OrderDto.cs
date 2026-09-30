using Facet;
using Infra;

namespace Service.Dtos;

[Facet(typeof(Order))]
public partial class OrderDto;

public class CreateOrderRequestDto
{
    public string BuyerId { get; set; } = "";
    public string ProductId { get; set; } = "";
    public int Quantity { get; set; }
}