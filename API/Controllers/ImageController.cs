using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
    private const int MaxWidth = 1200;

    [HttpPost(nameof(Upload))]
    public async Task<ImageUploadResponse> Upload(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ValidationException("Only jpg, png and webp are allowed.");
        if (file.Length == 0 || file.Length > MaxBytes)
            throw new ValidationException("File must be between 1 byte and 2 MB.");

        var folder = Path.Combine(env.WebRootPath, "uploads");
        Directory.CreateDirectory(folder);
        var fileName = $"{Guid.NewGuid()}{extension}";

        await using var input = file.OpenReadStream();

        Image image;
        try
        {
            image = await Image.LoadAsync(input);
        }
        catch (Exception ex) when (ex is UnknownImageFormatException or InvalidImageContentException)
        {
            throw new ValidationException("File is not a valid image.");
        }

        using (image)
        {
            if (image.Width > MaxWidth)
                image.Mutate(x => x.Resize(MaxWidth, 0)); // 0 keeps the aspect ratio
            await image.SaveAsync(Path.Combine(folder, fileName));
        }

        return new ImageUploadResponse($"/uploads/{fileName}");
    }
}