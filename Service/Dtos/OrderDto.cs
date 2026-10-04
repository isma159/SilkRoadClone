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

public class UpdateOrderStatusRequestDto
{
    public string OrderId { get; set; } = "";
    public string Status { get; set; } = "";
}