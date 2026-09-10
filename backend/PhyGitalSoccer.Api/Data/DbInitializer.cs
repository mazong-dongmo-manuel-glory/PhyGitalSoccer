using PhyGitalSoccer.Api.Enums;
using PhyGitalSoccer.Api.Models;

namespace PhyGitalSoccer.Api.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Teams.Any())
        {
            return; // DB has been seeded
        }

        // 8 Teams
        var team1 = new Team { Id = Guid.NewGuid(), Name = "PhygyTal Maple P", Group = "A", ColorHex = "#FF007F", LogoUrl = "/logos/phygytal-p.png" };
        var team2 = new Team { Id = Guid.NewGuid(), Name = "Quantum Wolves", Group = "A", ColorHex = "#00E5FF", LogoUrl = "/logos/quantum-wolves.png" };
        var team3 = new Team { Id = Guid.NewGuid(), Name = "Neo Titans", Group = "A", ColorHex = "#FFD700", LogoUrl = "/logos/neo-titans.png" };
        var team4 = new Team { Id = Guid.NewGuid(), Name = "Vortex United", Group = "A", ColorHex = "#00FF88", LogoUrl = "/logos/vortex-united.png" };

        var team5 = new Team { Id = Guid.NewGuid(), Name = "Apex Predators", Group = "B", ColorHex = "#A855F7", LogoUrl = "/logos/apex-predators.png" };
        var team6 = new Team { Id = Guid.NewGuid(), Name = "Aurora FC", Group = "B", ColorHex = "#38BDF8", LogoUrl = "/logos/aurora-fc.png" };
        var team7 = new Team { Id = Guid.NewGuid(), Name = "Hyperion Athletix", Group = "B", ColorHex = "#FB923C", LogoUrl = "/logos/hyperion-athletix.png" };
        var team8 = new Team { Id = Guid.NewGuid(), Name = "Zenith Gliders", Group = "B", ColorHex = "#F43F5E", LogoUrl = "/logos/zenith-gliders.png" };

        context.Teams.AddRange(team1, team2, team3, team4, team5, team6, team7, team8);

        // Seed Players for Team 1
        var p1 = new Player { Id = Guid.NewGuid(), TeamId = team1.Id, Name = "Marc-Antoine Tremblay", Position = PlayerPosition.Forward, JerseyNumber = 10 };
        var p2 = new Player { Id = Guid.NewGuid(), TeamId = team1.Id, Name = "Lucas Bélanger", Position = PlayerPosition.Midfielder, JerseyNumber = 7 };
        var p3 = new Player { Id = Guid.NewGuid(), TeamId = team1.Id, Name = "Maxime Côté", Position = PlayerPosition.Defender, JerseyNumber = 4 };
        var p4 = new Player { Id = Guid.NewGuid(), TeamId = team1.Id, Name = "Samuel Roy", Position = PlayerPosition.Goalkeeper, JerseyNumber = 1 };

        // Team 2
        var p5 = new Player { Id = Guid.NewGuid(), TeamId = team2.Id, Name = "David Novak", Position = PlayerPosition.Forward, JerseyNumber = 9 };
        var p6 = new Player { Id = Guid.NewGuid(), TeamId = team2.Id, Name = "Alexandre Chen", Position = PlayerPosition.Midfielder, JerseyNumber = 8 };
        var p7 = new Player { Id = Guid.NewGuid(), TeamId = team2.Id, Name = "Gabriel Royer", Position = PlayerPosition.Defender, JerseyNumber = 5 };
        var p8 = new Player { Id = Guid.NewGuid(), TeamId = team2.Id, Name = "Thomas Moreau", Position = PlayerPosition.Goalkeeper, JerseyNumber = 16 };

        // Team 5
        var p9 = new Player { Id = Guid.NewGuid(), TeamId = team5.Id, Name = "Enzo Ricci", Position = PlayerPosition.Forward, JerseyNumber = 11 };
        var p10 = new Player { Id = Guid.NewGuid(), TeamId = team5.Id, Name = "Karim Benali", Position = PlayerPosition.Midfielder, JerseyNumber = 6 };

        context.Players.AddRange(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

        // Matches: Group A Match 1 (Completed with hybrid score)
        var match1 = new Match
        {
            Id = Guid.NewGuid(),
            Stage = MatchStage.GroupA,
            Status = MatchStatus.Completed,
            ScheduledDate = DateTime.UtcNow.AddDays(-1),
            Venue = "Phygital Arena 1 - Montréal",
            Team1Id = team1.Id,
            Team2Id = team2.Id
        };

        // Match 1 Physical Round: Team 1 (2 goals) vs Team 2 (1 goal)
        var stat1PhysTeam1 = new TeamMatchStat
        {
            MatchId = match1.Id,
            TeamId = team1.Id,
            Type = MatchType.Physical,
            Goals = 2,
            PossessionPercentage = 54.5m,
            TotalShots = 11,
            ShotsOnTarget = 6,
            Corners = 4,
            Fouls = 5,
            Offsides = 1,
            YellowCards = 1
        };
        var stat1PhysTeam2 = new TeamMatchStat
        {
            MatchId = match1.Id,
            TeamId = team2.Id,
            Type = MatchType.Physical,
            Goals = 1,
            PossessionPercentage = 45.5m,
            TotalShots = 8,
            ShotsOnTarget = 3,
            Corners = 2,
            Fouls = 7,
            Offsides = 2,
            YellowCards = 2
        };

        // Match 1 Digital Round (Console / FIFA): Team 1 (3 goals) vs Team 2 (2 goals)
        var stat1DigTeam1 = new TeamMatchStat
        {
            MatchId = match1.Id,
            TeamId = team1.Id,
            Type = MatchType.Digital,
            Goals = 3,
            PossessionPercentage = 58.0m,
            TotalShots = 14,
            ShotsOnTarget = 8,
            Corners = 5,
            Fouls = 2,
            Offsides = 0
        };
        var stat1DigTeam2 = new TeamMatchStat
        {
            MatchId = match1.Id,
            TeamId = team2.Id,
            Type = MatchType.Digital,
            Goals = 2,
            PossessionPercentage = 42.0m,
            TotalShots = 9,
            ShotsOnTarget = 5,
            Corners = 3,
            Fouls = 4,
            Offsides = 1
        };

        // Match 2: Group A upcoming
        var match2 = new Match
        {
            Id = Guid.NewGuid(),
            Stage = MatchStage.GroupA,
            Status = MatchStatus.Scheduled,
            ScheduledDate = DateTime.UtcNow.AddHours(4),
            Venue = "Phygital Arena 2",
            Team1Id = team3.Id,
            Team2Id = team4.Id
        };

        // Match 3: Group B upcoming
        var match3 = new Match
        {
            Id = Guid.NewGuid(),
            Stage = MatchStage.GroupB,
            Status = MatchStatus.Scheduled,
            ScheduledDate = DateTime.UtcNow.AddHours(7),
            Venue = "Phygital Arena 1",
            Team1Id = team5.Id,
            Team2Id = team6.Id
        };

        // Match 4: Group B upcoming
        var match4 = new Match
        {
            Id = Guid.NewGuid(),
            Stage = MatchStage.GroupB,
            Status = MatchStatus.Scheduled,
            ScheduledDate = DateTime.UtcNow.AddDays(1),
            Venue = "Phygital Arena 2",
            Team1Id = team7.Id,
            Team2Id = team8.Id
        };

        context.Matches.AddRange(match1, match2, match3, match4);
        context.TeamMatchStats.AddRange(stat1PhysTeam1, stat1PhysTeam2, stat1DigTeam1, stat1DigTeam2);

        // Player individual stats for match 1
        context.PlayerMatchStats.AddRange(
            new PlayerMatchStat { MatchId = match1.Id, PlayerId = p1.Id, Type = MatchType.Physical, Goals = 2, Assists = 0 },
            new PlayerMatchStat { MatchId = match1.Id, PlayerId = p2.Id, Type = MatchType.Physical, Goals = 0, Assists = 2 },
            new PlayerMatchStat { MatchId = match1.Id, PlayerId = p5.Id, Type = MatchType.Physical, Goals = 1, Assists = 0 },
            new PlayerMatchStat { MatchId = match1.Id, PlayerId = p1.Id, Type = MatchType.Digital, Goals = 2, Assists = 1 },
            new PlayerMatchStat { MatchId = match1.Id, PlayerId = p2.Id, Type = MatchType.Digital, Goals = 1, Assists = 1 },
            new PlayerMatchStat { MatchId = match1.Id, PlayerId = p5.Id, Type = MatchType.Digital, Goals = 2, Assists = 0 }
        );

        context.SaveChanges();
    }
}
