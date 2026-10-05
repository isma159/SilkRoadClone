using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class OrderController(OrderService service) : ControllerBase
{
    [HttpGet(nameof(GetAll))]
    public List<OrderDto> GetAll() => service.GetAll();

    [HttpPost(nameof(Create))]
    public OrderDto Create([FromBody] CreateOrderRequestDto request) => service.Create(request);
    
    [HttpPatch(nameof(UpdateStatus))]
    public OrderDto UpdateStatus([FromBody] UpdateOrderStatusRequestDto request) => service.UpdateStatus(request);
    
    [HttpGet(nameof(GetVendorsAboveThreshold))]
    public List<VendorStatsDto> GetVendorsAboveThreshold([FromQuery] int threshold)
        => service.GetVendorsAboveThreshold(threshold);
}