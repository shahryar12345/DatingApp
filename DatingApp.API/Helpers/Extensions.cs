namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AppApplicationError(this Microsoft.AspNetCore.Http.HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error" , message);
            response.Headers.Add("Access-Control-Expose-Headers" , "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }
}