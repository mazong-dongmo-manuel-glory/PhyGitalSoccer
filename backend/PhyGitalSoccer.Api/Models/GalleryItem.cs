namespace PhyGitalSoccer.Api.Models;

public class GalleryItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = "image"; // "image" or "video"
    public string Category { get; set; } = "Match"; // "Match", "Esports", "Ceremony", "Teaser"
    public DateTime DateAdded { get; set; } = DateTime.UtcNow;
}
