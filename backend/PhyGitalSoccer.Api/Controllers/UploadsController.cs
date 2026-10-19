using Microsoft.AspNetCore.Mvc;
using PhyGitalSoccer.Api.Services;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly UploadStorage _storage;

    public UploadsController(UploadStorage storage)
    {
        _storage = storage;
    }

    [AdminOnly]
    [HttpPost]
    [RequestSizeLimit(UploadStorage.MaxVideoBytes + 1024 * 1024)]
    [RequestFormLimits(MultipartBodyLengthLimit = UploadStorage.MaxVideoBytes + 1024 * 1024)]
    public async Task<IActionResult> Upload(IFormFile? file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier reçu." });

        try
        {
            var stored = await _storage.SaveAsync(file, ct);
            var url = $"{Request.Scheme}://{Request.Host}{UploadStorage.RequestPath}/{stored.FileName}";
            return Ok(new { url, type = stored.Type });
        }
        catch (InvalidDataException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
