using System.Text.Json.Serialization;
using PhyGitalSoccer.Api.Enums;

namespace PhyGitalSoccer.Api.Models;

public class PlayerMatchStat
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MatchId { get; set; }
    [JsonIgnore]
    public Match? Match { get; set; }

    public Guid PlayerId { get; set; }
    public Player? Player { get; set; }

    public MatchType Type { get; set; } // Physical or Digital

    public int Goals { get; set; }
    public int Assists { get; set; }
    public int YellowCards { get; set; }
    public int RedCards { get; set; }
}
