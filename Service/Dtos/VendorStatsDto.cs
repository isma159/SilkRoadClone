namespace Service.Dtos;

public record VendorStatsDto(string VendorId, string VendorName, int CompletedOrderCount, int Rank);