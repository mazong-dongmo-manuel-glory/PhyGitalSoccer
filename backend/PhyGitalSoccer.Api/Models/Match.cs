using PhyGitalSoccer.Api.Enums;

namespace PhyGitalSoccer.Api.Models;

public class Match
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public MatchStage Stage { get; set; }
    public MatchStatus Status { get; set; } = MatchStatus.Scheduled;
    public DateTime ScheduledDate { get; set; }
    public string? Venue { get; set; }

    public Guid Team1Id { get; set; }
    public Team? Team1 { get; set; }

    public Guid Team2Id { get; set; }
    public Team? Team2 { get; set; }

    // Optional penalty shootouts (only used if aggregate score is tied)
    public int? Team1Penalties { get; set; }
    public int? Team2Penalties { get; set; }

    public ICollection<TeamMatchStat> TeamStats { get; set; } = new List<TeamMatchStat>();
    public ICollection<PlayerMatchStat> PlayerStats { get; set; } = new List<PlayerMatchStat>();
}
