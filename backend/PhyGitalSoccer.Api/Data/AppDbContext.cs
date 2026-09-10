using Microsoft.EntityFrameworkCore;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Player> Players => Set<Player>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<TeamMatchStat> TeamMatchStats => Set<TeamMatchStat>();
    public DbSet<PlayerMatchStat> PlayerMatchStats => Set<PlayerMatchStat>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();
    public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Match relationships
        modelBuilder.Entity<Match>()
            .HasOne(m => m.Team1)
            .WithMany()
            .HasForeignKey(m => m.Team1Id)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.Team2)
            .WithMany()
            .HasForeignKey(m => m.Team2Id)
            .OnDelete(DeleteBehavior.Restrict);

        // TeamMatchStat
        modelBuilder.Entity<TeamMatchStat>()
            .HasOne(s => s.Match)
            .WithMany(m => m.TeamStats)
            .HasForeignKey(s => s.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TeamMatchStat>()
            .HasOne(s => s.Team)
            .WithMany()
            .HasForeignKey(s => s.TeamId)
            .OnDelete(DeleteBehavior.Restrict);

        // PlayerMatchStat
        modelBuilder.Entity<PlayerMatchStat>()
            .HasOne(s => s.Match)
            .WithMany(m => m.PlayerStats)
            .HasForeignKey(s => s.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlayerMatchStat>()
            .HasOne(s => s.Player)
            .WithMany()
            .HasForeignKey(s => s.PlayerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Team to Player
        modelBuilder.Entity<Player>()
            .HasOne(p => p.Team)
            .WithMany(t => t.Players)
            .HasForeignKey(p => p.TeamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
