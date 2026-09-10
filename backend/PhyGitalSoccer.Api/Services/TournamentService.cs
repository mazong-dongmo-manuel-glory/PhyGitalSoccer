using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Data;
using PhyGitalSoccer.Api.DTOs;
using PhyGitalSoccer.Api.Enums;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.Services;

public class TournamentService
{
    private readonly AppDbContext _context;

    public TournamentService(AppDbContext context)
    {
        _context = context;
    }

    public MatchDetailDto MapToMatchDetailDto(Match match)
    {
        var t1Phys = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team1Id && s.Type == MatchType.Physical);
        var t2Phys = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team2Id && s.Type == MatchType.Physical);

        var t1Dig = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team1Id && s.Type == MatchType.Digital);
        var t2Dig = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team2Id && s.Type == MatchType.Digital);

        int t1PhysGoals = t1Phys?.Goals ?? 0;
        int t2PhysGoals = t2Phys?.Goals ?? 0;

        int t1DigGoals = t1Dig?.Goals ?? 0;
        int t2DigGoals = t2Dig?.Goals ?? 0;

        int t1Total = t1PhysGoals + t1DigGoals;
        int t2Total = t2PhysGoals + t2DigGoals;

        bool requiresPenalties = match.Status == MatchStatus.Completed && t1Total == t2Total;

        Guid? winnerId = null;
        string? winnerName = null;

        if (match.Status == MatchStatus.Completed)
        {
            if (t1Total > t2Total)
            {
                winnerId = match.Team1Id;
                winnerName = match.Team1?.Name;
            }
            else if (t2Total > t1Total)
            {
                winnerId = match.Team2Id;
                winnerName = match.Team2?.Name;
            }
            else if (match.Team1Penalties.HasValue && match.Team2Penalties.HasValue)
            {
                if (match.Team1Penalties > match.Team2Penalties)
                {
                    winnerId = match.Team1Id;
                    winnerName = match.Team1?.Name;
                }
                else if (match.Team2Penalties > match.Team1Penalties)
                {
                    winnerId = match.Team2Id;
                    winnerName = match.Team2?.Name;
                }
            }
        }

        var playerStatsDto = match.PlayerStats.Select(ps => new PlayerMatchStatDto
        {
            PlayerId = ps.PlayerId,
            PlayerName = ps.Player?.Name ?? "Joueur inconnu",
            TeamId = ps.Player?.TeamId ?? Guid.Empty,
            TeamName = ps.Player?.Team?.Name ?? "",
            Type = ps.Type,
            Goals = ps.Goals,
            Assists = ps.Assists,
            YellowCards = ps.YellowCards,
            RedCards = ps.RedCards
        }).ToList();

        return new MatchDetailDto
        {
            Id = match.Id,
            Stage = match.Stage,
            Status = match.Status,
            ScheduledDate = match.ScheduledDate,
            Venue = match.Venue,
            Team1Id = match.Team1Id,
            Team1Name = match.Team1?.Name ?? "Équipe 1",
            Team1LogoUrl = match.Team1?.LogoUrl,
            Team1ColorHex = match.Team1?.ColorHex,
            Team2Id = match.Team2Id,
            Team2Name = match.Team2?.Name ?? "Équipe 2",
            Team2LogoUrl = match.Team2?.LogoUrl,
            Team2ColorHex = match.Team2?.ColorHex,
            Team1PhysicalGoals = t1PhysGoals,
            Team2PhysicalGoals = t2PhysGoals,
            Team1PhysicalStat = t1Phys,
            Team2PhysicalStat = t2Phys,
            Team1DigitalGoals = t1DigGoals,
            Team2DigitalGoals = t2DigGoals,
            Team1DigitalStat = t1Dig,
            Team2DigitalStat = t2Dig,
            Team1TotalGoals = t1Total,
            Team2TotalGoals = t2Total,
            Team1Penalties = match.Team1Penalties,
            Team2Penalties = match.Team2Penalties,
            RequiresPenalties = requiresPenalties,
            WinnerTeamId = winnerId,
            WinnerName = winnerName,
            PlayerStats = playerStatsDto
        };
    }

    public async Task<Dictionary<string, List<GroupStandingDto>>> GetGroupStandingsAsync()
    {
        var teams = await _context.Teams.ToListAsync();
        var matches = await _context.Matches
            .Include(m => m.TeamStats)
            .Where(m => m.Status == MatchStatus.Completed && (m.Stage == MatchStage.GroupA || m.Stage == MatchStage.GroupB))
            .ToListAsync();

        var standings = teams.Select(t => new GroupStandingDto
        {
            TeamId = t.Id,
            TeamName = t.Name,
            LogoUrl = t.LogoUrl,
            ColorHex = t.ColorHex,
            Group = t.Group
        }).ToDictionary(s => s.TeamId);

        foreach (var match in matches)
        {
            if (!standings.ContainsKey(match.Team1Id) || !standings.ContainsKey(match.Team2Id))
                continue;

            var s1 = standings[match.Team1Id];
            var s2 = standings[match.Team2Id];

            s1.Played++;
            s2.Played++;

            int t1Phys = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team1Id && s.Type == MatchType.Physical)?.Goals ?? 0;
            int t2Phys = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team2Id && s.Type == MatchType.Physical)?.Goals ?? 0;

            int t1Dig = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team1Id && s.Type == MatchType.Digital)?.Goals ?? 0;
            int t2Dig = match.TeamStats.FirstOrDefault(s => s.TeamId == match.Team2Id && s.Type == MatchType.Digital)?.Goals ?? 0;

            int t1Total = t1Phys + t1Dig;
            int t2Total = t2Phys + t2Dig;

            s1.PhysicalGoalsFor += t1Phys;
            s1.DigitalGoalsFor += t1Dig;
            s1.GoalsFor += t1Total;
            s1.GoalsAgainst += t2Total;

            s2.PhysicalGoalsFor += t2Phys;
            s2.DigitalGoalsFor += t2Dig;
            s2.GoalsFor += t2Total;
            s2.GoalsAgainst += t1Total;

            if (t1Total > t2Total)
            {
                s1.Won++;
                s2.Lost++;
            }
            else if (t2Total > t1Total)
            {
                s2.Won++;
                s1.Lost++;
            }
            else
            {
                s1.Drawn++;
                s2.Drawn++;
            }
        }

        var result = new Dictionary<string, List<GroupStandingDto>>
        {
            ["A"] = standings.Values
                .Where(s => s.Group == "A")
                .OrderByDescending(s => s.Points)
                .ThenByDescending(s => s.GoalDifference)
                .ThenByDescending(s => s.GoalsFor)
                .ToList(),
            ["B"] = standings.Values
                .Where(s => s.Group == "B")
                .OrderByDescending(s => s.Points)
                .ThenByDescending(s => s.GoalDifference)
                .ThenByDescending(s => s.GoalsFor)
                .ToList()
        };

        return result;
    }

    public async Task<List<TopScorerDto>> GetTopScorersAsync()
    {
        var playerStats = await _context.PlayerMatchStats
            .Include(ps => ps.Player)
                .ThenInclude(p => p!.Team)
            .ToListAsync();

        var grouped = playerStats
            .Where(ps => ps.Player != null)
            .GroupBy(ps => ps.PlayerId)
            .Select(g =>
            {
                var player = g.First().Player!;
                return new TopScorerDto
                {
                    PlayerId = player.Id,
                    PlayerName = player.Name,
                    TeamName = player.Team?.Name ?? "N/A",
                    TeamColorHex = player.Team?.ColorHex,
                    Position = player.Position,
                    PhysicalGoals = g.Where(x => x.Type == MatchType.Physical).Sum(x => x.Goals),
                    DigitalGoals = g.Where(x => x.Type == MatchType.Digital).Sum(x => x.Goals),
                    Assists = g.Sum(x => x.Assists)
                };
            })
            .Where(s => s.TotalGoals > 0 || s.Assists > 0)
            .OrderByDescending(s => s.TotalGoals)
            .ThenByDescending(s => s.Assists)
            .ToList();

        return grouped;
    }
}
