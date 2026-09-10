using System.Text.Json.Serialization;
using PhyGitalSoccer.Api.Enums;

namespace PhyGitalSoccer.Api.Models;

public class Player
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TeamId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public PlayerPosition Position { get; set; }
    public int? JerseyNumber { get; set; }

    [JsonIgnore]
    public Team? Team { get; set; }
}
