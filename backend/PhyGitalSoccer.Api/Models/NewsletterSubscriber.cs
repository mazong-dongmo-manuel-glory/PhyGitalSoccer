namespace PhyGitalSoccer.Api.Models;

public class NewsletterSubscriber
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public DateTime SubscribedDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
