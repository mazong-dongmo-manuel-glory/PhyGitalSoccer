using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PhyGitalSoccer.Api.Services;

/// <summary>Requires a valid admin bearer token issued by <see cref="AdminAuthService"/>.</summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var auth = context.HttpContext.RequestServices.GetRequiredService<AdminAuthService>();
        var header = context.HttpContext.Request.Headers.Authorization.ToString();
        var token = header.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) ? header[7..].Trim() : null;

        if (!auth.ValidateToken(token))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Authentification administrateur requise." });
        }
    }
}
