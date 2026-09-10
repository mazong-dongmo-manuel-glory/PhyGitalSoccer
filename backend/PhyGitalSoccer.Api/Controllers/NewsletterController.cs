using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Data;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewsletterController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
        {
            return BadRequest(new { message = "Adresse courriel invalide." });
        }

        var existing = await _context.NewsletterSubscribers.FirstOrDefaultAsync(s => s.Email.ToLower() == request.Email.ToLower());
        if (existing != null)
        {
            existing.IsActive = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Vous êtes déjà inscrit à la newsletter !" });
        }

        var subscriber = new NewsletterSubscriber
        {
            Email = request.Email.Trim().ToLower(),
            SubscribedDate = DateTime.UtcNow,
            IsActive = true
        };

        _context.NewsletterSubscribers.Add(subscriber);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Merci pour votre inscription à la newsletter PhyGital Soccer !" });
    }

    [HttpGet("subscribers")]
    public async Task<ActionResult<IEnumerable<NewsletterSubscriber>>> GetSubscribers()
    {
        return await _context.NewsletterSubscribers.OrderByDescending(s => s.SubscribedDate).ToListAsync();
    }
}

public class SubscribeRequest
{
    public string Email { get; set; } = string.Empty;
}
