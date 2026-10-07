using Facet;
using Infra;

namespace Service.Dtos;

[Facet(typeof(Product), GenerateToSource = false)]
public partial record ProductResponse;

[Facet(typeof(Product),
    [nameof(Product.Id), nameof(Product.IsActive), nameof(Product.CreatedAtUtc), nameof(Product.Vendor)],
    GenerateToSource = false)]
public partial record ProductCreateRequest;

[Facet(typeof(Product),
    [nameof(Product.VendorId), nameof(Product.CreatedAtUtc), nameof(Product.IsActive), nameof(Product.Vendor)],
    NullableProperties = true,
    GenerateToSource = false)]
public partial record ProductUpdateRequest
{
    public string Id { get; init; } = "";
}