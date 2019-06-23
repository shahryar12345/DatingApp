using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepositor
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         
         Task<bool> SaveAll();


        // Below pagination ,Simple one
        //  Task<IEnumerable<User>> GetUsers();

        // After Pagination Implimantation
         Task<PagedList<User>> GetUsers(UserParams userParams);
         
         Task<User> GetUser(int id);


         Task<Photo> GetPhoto(int id);
         Task<Photo> GetMainPhotoForUser(int UserId);
    }
}