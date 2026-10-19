using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Data;
using PhyGitalSoccer.Api.DTOs;
using PhyGitalSoccer.Api.Enums;
using PhyGitalSoccer.Api.Models;
using PhyGitalSoccer.Api.Services;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TournamentService _tournamentService;

    public MatchesController(AppDbContext context, TournamentService tournamentService)
    {
        _context = context;
        _tournamentService = tournamentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MatchDetailDto>>> GetMatches([FromQuery] MatchStage? stage, [FromQuery] MatchStatus? status)
    {
        var query = _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .Include(m => m.TeamStats)
            .Include(m => m.PlayerStats)
                .ThenInclude(ps => ps.Player)
                    .ThenInclude(p => p!.Team)
            .OrderBy(m => m.ScheduledDate)
            .AsQueryable();

        if (stage.HasValue)
            query = query.Where(m => m.Stage == stage.Value);

        if (status.HasValue)
            query = query.Where(m => m.Status == status.Value);

        var matches = await query.ToListAsync();
        var dtos = matches.Select(m => _tournamentService.MapToMatchDetailDto(m)).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MatchDetailDto>> GetMatch(Guid id)
    {
        var match = await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .Include(m => m.TeamStats)
            .Include(m => m.PlayerStats)
                .ThenInclude(ps => ps.Player)
                    .ThenInclude(p => p!.Team)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null) return NotFound();

        return Ok(_tournamentService.MapToMatchDetailDto(match));
    }

    [AdminOnly]
    [HttpPost]
    public async Task<ActionResult<MatchDetailDto>> CreateMatch(Match match)
    {
        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        var created = await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .Include(m => m.TeamStats)
            .Include(m => m.PlayerStats)
            .FirstAsync(m => m.Id == match.Id);

        return CreatedAtAction(nameof(GetMatch), new { id = match.Id }, _tournamentService.MapToMatchDetailDto(created));
    }

    [AdminOnly]
    [HttpPut("{id}/sheet")]
    public async Task<ActionResult<MatchDetailDto>> UpdateMatchSheet(Guid id, [FromBody] MatchSheetUpdateDto sheet)
    {
        var match = await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .Include(m => m.TeamStats)
            .Include(m => m.PlayerStats)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null) return NotFound();

        match.Status = sheet.Status;
        match.ScheduledDate = sheet.ScheduledDate;
        if (!string.IsNullOrEmpty(sheet.Venue))
            match.Venue = sheet.Venue;

        // Clear existing stats to re-apply updated sheet
        _context.TeamMatchStats.RemoveRange(match.TeamStats);
        _context.PlayerMatchStats.RemoveRange(match.PlayerStats);

        // 1. Physical stats
        if (sheet.Team1PhysicalStat != null)
        {
            _context.TeamMatchStats.Add(new TeamMatchStat
            {
                MatchId = id,
                TeamId = match.Team1Id,
                Type = MatchType.Physical,
                Goals = sheet.Team1PhysicalStat.Goals,
                PossessionPercentage = sheet.Team1PhysicalStat.PossessionPercentage,
                TotalShots = sheet.Team1PhysicalStat.TotalShots,
                ShotsOnTarget = sheet.Team1PhysicalStat.ShotsOnTarget,
                Corners = sheet.Team1PhysicalStat.Corners,
                Fouls = sheet.Team1PhysicalStat.Fouls,
                Offsides = sheet.Team1PhysicalStat.Offsides,
                YellowCards = sheet.Team1PhysicalStat.YellowCards,
                RedCards = sheet.Team1PhysicalStat.RedCards
            });
        }

        if (sheet.Team2PhysicalStat != null)
        {
            _context.TeamMatchStats.Add(new TeamMatchStat
            {
                MatchId = id,
                TeamId = match.Team2Id,
                Type = MatchType.Physical,
                Goals = sheet.Team2PhysicalStat.Goals,
                PossessionPercentage = sheet.Team2PhysicalStat.PossessionPercentage,
                TotalShots = sheet.Team2PhysicalStat.TotalShots,
                ShotsOnTarget = sheet.Team2PhysicalStat.ShotsOnTarget,
                Corners = sheet.Team2PhysicalStat.Corners,
                Fouls = sheet.Team2PhysicalStat.Fouls,
                Offsides = sheet.Team2PhysicalStat.Offsides,
                YellowCards = sheet.Team2PhysicalStat.YellowCards,
                RedCards = sheet.Team2PhysicalStat.RedCards
            });
        }

        // 2. Digital stats (e-sport / console)
        if (sheet.Team1DigitalStat != null)
        {
            _context.TeamMatchStats.Add(new TeamMatchStat
            {
                MatchId = id,
                TeamId = match.Team1Id,
                Type = MatchType.Digital,
                Goals = sheet.Team1DigitalStat.Goals,
                PossessionPercentage = sheet.Team1DigitalStat.PossessionPercentage,
                TotalShots = sheet.Team1DigitalStat.TotalShots,
                ShotsOnTarget = sheet.Team1DigitalStat.ShotsOnTarget,
                Corners = sheet.Team1DigitalStat.Corners,
                Fouls = sheet.Team1DigitalStat.Fouls,
                Offsides = sheet.Team1DigitalStat.Offsides,
                YellowCards = sheet.Team1DigitalStat.YellowCards,
                RedCards = sheet.Team1DigitalStat.RedCards
            });
        }

        if (sheet.Team2DigitalStat != null)
        {
            _context.TeamMatchStats.Add(new TeamMatchStat
            {
                MatchId = id,
                TeamId = match.Team2Id,
                Type = MatchType.Digital,
                Goals = sheet.Team2DigitalStat.Goals,
                PossessionPercentage = sheet.Team2DigitalStat.PossessionPercentage,
                TotalShots = sheet.Team2DigitalStat.TotalShots,
                ShotsOnTarget = sheet.Team2DigitalStat.ShotsOnTarget,
                Corners = sheet.Team2DigitalStat.Corners,
                Fouls = sheet.Team2DigitalStat.Fouls,
                Offsides = sheet.Team2DigitalStat.Offsides,
                YellowCards = sheet.Team2DigitalStat.YellowCards,
                RedCards = sheet.Team2DigitalStat.RedCards
            });
        }

        // 3. Penalty Shootout (conditional)
        match.Team1Penalties = sheet.Team1Penalties;
        match.Team2Penalties = sheet.Team2Penalties;

        // 4. Individual Player Stats
        if (sheet.PlayerStats != null && sheet.PlayerStats.Any())
        {
            foreach (var ps in sheet.PlayerStats)
            {
                _context.PlayerMatchStats.Add(new PlayerMatchStat
                {
                    MatchId = id,
                    PlayerId = ps.PlayerId,
                    Type = ps.Type,
                    Goals = ps.Goals,
                    Assists = ps.Assists,
                    YellowCards = ps.YellowCards,
                    RedCards = ps.RedCards
                });
            }
        }

        await _context.SaveChangesAsync();

        var updated = await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .Include(m => m.TeamStats)
            .Include(m => m.PlayerStats)
                .ThenInclude(p => p.Player)
                    .ThenInclude(pl => pl!.Team)
            .FirstAsync(m => m.Id == id);

        return Ok(_tournamentService.MapToMatchDetailDto(updated));
    }
}
