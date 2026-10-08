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

    [HttpGet("GetAllFromVendor/{vendorId}")]
    public List<OrderDto> GetAllFromVendor(string vendorId) => service.GetAllFromVendor(vendorId);

    [HttpGet("GetCompletedSales/{buyerId}/{vendorId}")]
    public int GetCompletedSales(string buyerId, string vendorId) =>
        service.CountCompletedOrders(buyerId, vendorId);

    [HttpPost(nameof(Create))]
    public OrderDto Create([FromBody] CreateOrderRequestDto request) => service.Create(request);
    
    [HttpPatch(nameof(UpdateStatus))]
    public OrderDto UpdateStatus([FromBody] UpdateOrderStatusRequestDto request) => service.UpdateStatus(request);
    
    [HttpGet(nameof(GetVendorsAboveThreshold))]
    public List<VendorStatsDto> GetVendorsAboveThreshold([FromQuery] int threshold, [FromQuery] int? limit = null)
        => service.GetVendorsAboveThreshold(threshold, limit);
}