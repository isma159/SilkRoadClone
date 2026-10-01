using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public record ImageUploadResponse(string Url);

[ApiController]
[Route("[controller]")]
public class ImageController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxBytes = 2 * 1024 * 1024;

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

        await using var stream = System.IO.File.Create(Path.Combine(folder, fileName));
        await file.CopyToAsync(stream);

        return new ImageUploadResponse($"/uploads/{fileName}");
    }
}