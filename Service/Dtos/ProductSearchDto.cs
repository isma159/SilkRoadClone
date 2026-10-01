namespace Service.Dtos;

public class ProductSearchDto
{
    public string? CategoryId { get; set; }
    public decimal? MinPriceDkk { get; set; }
    public decimal? MaxPriceDkk { get; set; }
    public string? Keyword { get; set; }
}