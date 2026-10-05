using Facet;
using Infra;

namespace Service.Dtos;

[Facet(typeof(Product), GenerateToSource = false)]
public partial record ProductResponse;

[Facet(typeof(Product),
    [nameof(Product.Id), nameof(Product.VendorId), nameof(Product.IsActive), nameof(Product.CreatedAtUtc)],
    GenerateToSource = false)]
public partial record ProductCreateRequest;

[Facet(typeof(Product),
    [nameof(Product.Id), nameof(Product.VendorId), nameof(Product.CreatedAtUtc), nameof(Product.IsActive)],
    NullableProperties = true,
    GenerateToSource = false)]
public partial record ProductUpdateRequest
{
    public string Id { get; init; } = "";
}