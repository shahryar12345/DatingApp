using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AppApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error" , message);
            response.Headers.Add("Access-Control-Expose-Headers" , "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response , int currentPage , int itemspPerPage, int totalIems , int totalPages)
        {
            var paginationHeader  = new PaginationHeader(currentPage , itemspPerPage , totalIems , totalPages);
            var camelCaseFormat = new  JsonSerializerSettings();
            camelCaseFormat.ContractResolver = new  CamelCasePropertyNamesContractResolver(); // Send Data in camelCase format , while seliazilation
            response.Headers.Add("Pagination" , JsonConvert.SerializeObject(paginationHeader , camelCaseFormat));
            response.Headers.Add("Access-Control-Expose-Headers" , "Pagination");         
        }

        public static int CalculateAge(this DateTime theDateTime)
        {
            var Age = DateTime.Today.Year - theDateTime.Year;
            if(theDateTime.AddYears(Age) > DateTime.Today)
            {
               Age--;
            }
            return Age; 
        } 
    }
}