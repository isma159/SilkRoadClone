using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace API.Controllers;

public record ImageUploadResponse(string Url);

[ApiController]
[Route("[controller]")]
public class ImageController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxBytes = 2 * 1024 * 1024;
    private const int MaxDimension = 1200;

    [HttpPost(nameof(Upload))]
    public async Task<ImageUploadResponse> Upload(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ValidationException("Only jpg, png and webp are allowed.");
        if (file.Length == 0 || file.Length > MaxBytes)
            throw new ValidationException("File must be between 1 byte and 2 MB.");

        var folder = Path.Combine(env.WebRootPath, "uploads");
        var fileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(folder, fileName);

        await using (var openStream = file.OpenReadStream())
        {
            using var image = await Image.LoadAsync(openStream);

            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(MaxDimension, MaxDimension)
            }));

            await image.SaveAsync(fullPath);
        }

        return new ImageUploadResponse($"/uploads/{fileName}");
    }
}