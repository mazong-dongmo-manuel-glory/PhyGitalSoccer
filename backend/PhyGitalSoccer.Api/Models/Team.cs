using System.Text.Json.Serialization;

namespace PhyGitalSoccer.Api.Models;

public class Team
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string Group { get; set; } = "A"; // "A" or "B"
    public string? ColorHex { get; set; } // Visual accent color

    public ICollection<Player> Players { get; set; } = new List<Player>();
}
