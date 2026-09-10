using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Data;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams([FromQuery] string? group)
    {
        var query = _context.Teams.Include(t => t.Players).AsQueryable();
        if (!string.IsNullOrEmpty(group))
        {
            query = query.Where(t => t.Group.ToUpper() == group.ToUpper());
        }
        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetTeam(Guid id)
    {
        var team = await _context.Teams
            .Include(t => t.Players)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null) return NotFound();
        return team;
    }

    [HttpPost]
    public async Task<ActionResult<Team>> CreateTeam(Team team)
    {
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(Guid id, Team updated)
    {
        if (id != updated.Id) return BadRequest();
        var existing = await _context.Teams.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = updated.Name;
        existing.LogoUrl = updated.LogoUrl;
        existing.Group = updated.Group;
        existing.ColorHex = updated.ColorHex;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/players")]
    public async Task<ActionResult<Player>> AddPlayer(Guid id, Player player)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return NotFound();

        player.TeamId = id;
        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        return Ok(player);
    }

    [HttpPut("players/{playerId}")]
    public async Task<IActionResult> UpdatePlayer(Guid playerId, Player updated)
    {
        if (playerId != updated.Id) return BadRequest();
        var existing = await _context.Players.FindAsync(playerId);
        if (existing == null) return NotFound();

        existing.Name = updated.Name;
        existing.PhotoUrl = updated.PhotoUrl;
        existing.Position = updated.Position;
        existing.JerseyNumber = updated.JerseyNumber;
        if (updated.TeamId != Guid.Empty)
        {
            existing.TeamId = updated.TeamId;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("players/{playerId}")]
    public async Task<IActionResult> DeletePlayer(Guid playerId)
    {
        var player = await _context.Players.FindAsync(playerId);
        if (player == null) return NotFound();

        _context.Players.Remove(player);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(Guid id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return NotFound();

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

