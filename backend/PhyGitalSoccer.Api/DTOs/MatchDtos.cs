using PhyGitalSoccer.Api.Enums;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.DTOs;

public class MatchDetailDto
{
    public Guid Id { get; set; }
    public MatchStage Stage { get; set; }
    public MatchStatus Status { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string? Venue { get; set; }

    public Guid Team1Id { get; set; }
    public string Team1Name { get; set; } = string.Empty;
    public string? Team1LogoUrl { get; set; }
    public string? Team1ColorHex { get; set; }

    public Guid Team2Id { get; set; }
    public string Team2Name { get; set; } = string.Empty;
    public string? Team2LogoUrl { get; set; }
    public string? Team2ColorHex { get; set; }

    // Physical Round
    public int Team1PhysicalGoals { get; set; }
    public int Team2PhysicalGoals { get; set; }
    public TeamMatchStat? Team1PhysicalStat { get; set; }
    public TeamMatchStat? Team2PhysicalStat { get; set; }

    // Digital Round
    public int Team1DigitalGoals { get; set; }
    public int Team2DigitalGoals { get; set; }
    public TeamMatchStat? Team1DigitalStat { get; set; }
    public TeamMatchStat? Team2DigitalStat { get; set; }

    // Total Aggregate
    public int Team1TotalGoals { get; set; }
    public int Team2TotalGoals { get; set; }

    // Penalties (if tied)
    public int? Team1Penalties { get; set; }
    public int? Team2Penalties { get; set; }
    public bool RequiresPenalties { get; set; }

    // Winner
    public Guid? WinnerTeamId { get; set; }
    public string? WinnerName { get; set; }

    public List<PlayerMatchStatDto> PlayerStats { get; set; } = new();
}

public class PlayerMatchStatDto
{
    public Guid PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public Guid TeamId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public MatchType Type { get; set; }
    public int Goals { get; set; }
    public int Assists { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
}

public class MatchSheetUpdateDto
{
    public MatchStatus Status { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string? Venue { get; set; }

    // Collective stats for Physical round
    public TeamMatchStatUpdateDto? Team1PhysicalStat { get; set; }
    public TeamMatchStatUpdateDto? Team2PhysicalStat { get; set; }

    // Collective stats for Digital round
    public TeamMatchStatUpdateDto? Team1DigitalStat { get; set; }
    public TeamMatchStatUpdateDto? Team2DigitalStat { get; set; }

    // Penalties
    public int? Team1Penalties { get; set; }
    public int? Team2Penalties { get; set; }

    // Player stats
    public List<PlayerMatchStatUpdateDto>? PlayerStats { get; set; }
}

public class TeamMatchStatUpdateDto
{
    public int Goals { get; set; }
    public decimal PossessionPercentage { get; set; }
    public int TotalShots { get; set; }
    public int ShotsOnTarget { get; set; }
    public int Corners { get; set; }
    public int Fouls { get; set; }
    public int Offsides { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
}

public class PlayerMatchStatUpdateDto
{
    public Guid PlayerId { get; set; }
    public MatchType Type { get; set; }
    public int Goals { get; set; }
    public int Assists { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
}

public class GroupStandingDto
{
    public Guid TeamId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? ColorHex { get; set; }
    public string Group { get; set; } = string.Empty;
    public int Played { get; set; }
    public int Won { get; set; }
    public int Drawn { get; set; }
    public int Lost { get; set; }
    public int PhysicalGoalsFor { get; set; }
    public int DigitalGoalsFor { get; set; }
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }
    public int GoalDifference => GoalsFor - GoalsAgainst;
    public int Points => (Won * 3) + (Drawn * 1);
}

public class TopScorerDto
{
    public Guid PlayerId { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public string TeamName { get; set; } = string.Empty;
    public string? TeamColorHex { get; set; }
    public PlayerPosition Position { get; set; }
    public int PhysicalGoals { get; set; }
    public int DigitalGoals { get; set; }
    public int TotalGoals => PhysicalGoals + DigitalGoals;
    public int Assists { get; set; }
}
