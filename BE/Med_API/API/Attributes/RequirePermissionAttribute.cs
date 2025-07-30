using System.Security.Claims;
using DB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Service;

namespace API.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class RequirePermissionAttribute : Attribute, IAuthorizationFilter
{
    private readonly Permissions _requiredPermission;

    public RequirePermissionAttribute(Permissions permission)
    {
        _requiredPermission = permission;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (!user.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var roleClaim = user.FindFirst(ClaimTypes.Role);
        if (roleClaim == null)
        {
            context.Result = new ForbidResult();
            return;
        }

        // Lấy role từ database và kiểm tra quyền
        var roleService = context.HttpContext.RequestServices.GetRequiredService<IRoleService>();
        var role = roleService.GetRoleByNameAsync(roleClaim.Value).Result;

        if (role == null || !role.Permissions.HasFlag(_requiredPermission))
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}
