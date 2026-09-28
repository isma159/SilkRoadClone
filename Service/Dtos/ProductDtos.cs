namespace API.Dtos;

public record ProductResponse(
    string Id,
    string Title,
    string? Description,
    decimal PriceDkk,
    int Stock,
    string? ShipsFrom,
    string? ImageUrl,
    string CategoryId,
    string VendorId,
    bool IsActive,
    DateTime CreatedAtUtc);

public record ProductCreateRequest(
    string Title,
    string? Description,
    decimal PriceDkk,
    int Stock,
    string? ShipsFrom,
    string? ImageUrl,
    string CategoryId);

public record ProductUpdateRequest(
    string Id,
    string? Title,
    string? Description,
    decimal? PriceDkk,
    int? Stock,
    string? ShipsFrom,
    string? ImageUrl,
    string? CategoryId);