using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PhyGitalSoccer.Api.Services;

namespace PhyGitalSoccer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AdminAuthService _auth;

    public AuthController(AdminAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public ActionResult Login(LoginRequest request)
    {
        if (!_auth.IsConfigured)
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "Connexion administrateur non configurée sur le serveur." });

        if (!_auth.VerifyPassword(request.Password))
            return Unauthorized(new { message = "Mot de passe incorrect." });

        var (token, expiresAt) = _auth.IssueToken();
        return Ok(new { token, expiresAt });
    }

    [HttpGet("me")]
    [AdminOnly]
    public ActionResult Me() => Ok(new { role = "admin" });
}

public class LoginRequest
{
    public string Password { get; set; } = string.Empty;
}
