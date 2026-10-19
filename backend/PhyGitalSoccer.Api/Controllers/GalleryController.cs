using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Data;
using PhyGitalSoccer.Api.Services;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UploadStorage _storage;

    public GalleryController(AppDbContext context, UploadStorage storage)
    {
        _context = context;
        _storage = storage;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GalleryItem>>> GetGalleryItems()
    {
        var items = await _context.GalleryItems
            .OrderByDescending(g => g.DateAdded)
            .ToListAsync();
        return Ok(items);
    }

    [AdminOnly]
    [HttpPost]
    public async Task<ActionResult<GalleryItem>> AddGalleryItem(GalleryItem item)
    {
        _context.GalleryItems.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [AdminOnly]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGalleryItem(Guid id)
    {
        var item = await _context.GalleryItems.FindAsync(id);
        if (item == null) return NotFound();

        _context.GalleryItems.Remove(item);
        await _context.SaveChangesAsync();
        _storage.TryDelete(item.Url);
        return NoContent();
    }
}
