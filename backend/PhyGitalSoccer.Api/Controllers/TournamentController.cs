using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Data;
using PhyGitalSoccer.Api.DTOs;
using PhyGitalSoccer.Api.Enums;
using PhyGitalSoccer.Api.Services;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TournamentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TournamentService _tournamentService;

    public TournamentController(AppDbContext context, TournamentService tournamentService)
    {
        _context = context;
        _tournamentService = tournamentService;
    }

    [HttpGet("standings")]
    public async Task<ActionResult<Dictionary<string, List<GroupStandingDto>>>> GetStandings()
    {
        var standings = await _tournamentService.GetGroupStandingsAsync();
        return Ok(standings);
    }

    [HttpGet("top-scorers")]
    public async Task<ActionResult<List<TopScorerDto>>> GetTopScorers()
    {
        var scorers = await _tournamentService.GetTopScorersAsync();
        return Ok(scorers);
    }

    [HttpGet("bracket")]
    public async Task<ActionResult<object>> GetBracket()
    {
        var matches = await _context.Matches
            .Include(m => m.Team1)
            .Include(m => m.Team2)
            .Include(m => m.TeamStats)
            .ToListAsync();

        var dtos = matches.Select(m => _tournamentService.MapToMatchDetailDto(m)).ToList();

        var bracket = new
        {
            groupStageA = dtos.Where(m => m.Stage == MatchStage.GroupA).ToList(),
            groupStageB = dtos.Where(m => m.Stage == MatchStage.GroupB).ToList(),
            semiFinals = dtos.Where(m => m.Stage == MatchStage.SemiFinal).ToList(),
            thirdPlace = dtos.FirstOrDefault(m => m.Stage == MatchStage.ThirdPlace),
            final = dtos.FirstOrDefault(m => m.Stage == MatchStage.Final)
        };

        return Ok(bracket);
    }
}
