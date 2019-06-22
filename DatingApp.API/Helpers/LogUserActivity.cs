
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using DatingApp.API.Data;
using System;

namespace DatingApp.API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Context Use Before action Execution.
            // next use After action Execution.
            //throw new System.NotImplementedException();
            var resultContext = await next();
            var userID = int.Parse(resultContext.HttpContext.User
            .FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepositor>();
            var user = await repo.GetUser(userID);
            user.LastActive = DateTime.Now;
            await repo.SaveAll();
        }
    }
}