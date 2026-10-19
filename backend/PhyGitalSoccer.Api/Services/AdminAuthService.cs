using System.Security.Cryptography;
using System.Text;

namespace PhyGitalSoccer.Api.Services;

/// <summary>
/// Admin password check (PBKDF2-SHA256) and HMAC-signed, expiring bearer tokens.
/// Config: Admin:PasswordHash ("iterations.saltBase64.hashBase64"), optional Admin:TokenKey and Admin:TokenHours.
/// </summary>
public class AdminAuthService
{
    private const int DefaultIterations = 210_000;
    private readonly string? _passwordHash;
    private readonly byte[] _tokenKey;
    private readonly TimeSpan _tokenLifetime;

    public AdminAuthService(IConfiguration config, ILogger<AdminAuthService> logger)
    {
        _passwordHash = config["Admin:PasswordHash"];
        if (string.IsNullOrWhiteSpace(_passwordHash))
            logger.LogWarning("Admin:PasswordHash is not configured: admin login is disabled.");

        var key = config["Admin:TokenKey"];
        // Without a configured key, tokens are invalidated on every restart.
        _tokenKey = string.IsNullOrWhiteSpace(key) ? RandomNumberGenerator.GetBytes(32) : Encoding.UTF8.GetBytes(key);
        _tokenLifetime = TimeSpan.FromHours(config.GetValue("Admin:TokenHours", 12));
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_passwordHash);

    public static string HashPassword(string password, int iterations = DefaultIterations)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, 32);
        return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool VerifyPassword(string password)
    {
        if (!IsConfigured || string.IsNullOrEmpty(password)) return false;
        var parts = _passwordHash!.Split('.');
        if (parts.Length != 3 || !int.TryParse(parts[0], out var iterations)) return false;

        var salt = Convert.FromBase64String(parts[1]);
        var expected = Convert.FromBase64String(parts[2]);
        var actual = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, HashAlgorithmName.SHA256, expected.Length);
        return CryptographicOperations.FixedTimeEquals(actual, expected);
    }

    public (string Token, DateTimeOffset ExpiresAt) IssueToken()
    {
        var expiresAt = DateTimeOffset.UtcNow.Add(_tokenLifetime);
        var payload = Base64Url(Encoding.UTF8.GetBytes($"admin|{expiresAt.ToUnixTimeSeconds()}"));
        return ($"{payload}.{Sign(payload)}", expiresAt);
    }

    public bool ValidateToken(string? token)
    {
        if (string.IsNullOrEmpty(token)) return false;
        var parts = token.Split('.');
        if (parts.Length != 2) return false;

        var expectedSig = Encoding.ASCII.GetBytes(Sign(parts[0]));
        if (!CryptographicOperations.FixedTimeEquals(expectedSig, Encoding.ASCII.GetBytes(parts[1]))) return false;

        try
        {
            var fields = Encoding.UTF8.GetString(FromBase64Url(parts[0])).Split('|');
            return fields.Length == 2
                && fields[0] == "admin"
                && long.TryParse(fields[1], out var exp)
                && DateTimeOffset.FromUnixTimeSeconds(exp) > DateTimeOffset.UtcNow;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    private string Sign(string payload) =>
        Base64Url(HMACSHA256.HashData(_tokenKey, Encoding.UTF8.GetBytes(payload)));

    private static string Base64Url(byte[] data) =>
        Convert.ToBase64String(data).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[] FromBase64Url(string s)
    {
        var padded = s.Replace('-', '+').Replace('_', '/');
        return Convert.FromBase64String(padded.PadRight(padded.Length + (4 - padded.Length % 4) % 4, '='));
    }
}
