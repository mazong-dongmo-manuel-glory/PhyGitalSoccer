using System.Text.Json.Serialization;
using PhyGitalSoccer.Api.Enums;

namespace PhyGitalSoccer.Api.Models;

public class TeamMatchStat
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MatchId { get; set; }
    [JsonIgnore]
    public Match? Match { get; set; }

    public Guid TeamId { get; set; }
    public Team? Team { get; set; }

    public MatchType Type { get; set; } // Physical or Digital

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
