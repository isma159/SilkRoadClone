using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController(ProductService service) : ControllerBase
{
    [HttpGet(nameof(GetAll))]
    public List<ProductResponse> GetAll([FromQuery] string? categoryId, [FromQuery] string? search)
        => service.GetAll(categoryId, search);

    [HttpGet(nameof(GetById))]
    public ProductResponse GetById([FromQuery] string id) => service.GetById(id);

    [HttpPost(nameof(Create))]
    public ProductResponse Create([FromBody] ProductCreateRequest request) => service.Create(request);

    [HttpPatch(nameof(Update))]
    public ProductResponse Update([FromBody] ProductUpdateRequest request) => service.Update(request);

    [HttpDelete(nameof(Delete))]
    public void Delete([FromQuery] string id) => service.Delete(id);
    
    [HttpGet(nameof(SearchProducts))]
    public List<ProductResponse> SearchProducts([FromQuery] ProductSearchDto dto) => service.Search(dto);
}