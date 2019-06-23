using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepositor
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
         _context = context;   
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        } 

        // Without Pagination
        // public async Task<IEnumerable<User>> GetUsers()
        // {
        //     var users = await _context.Users.Include(p => p.Photos).ToListAsync();
        //     return  users;
        // }
        
        public async Task<bool> SaveAll()
        {
            return (await _context.SaveChangesAsync() > 0);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(x => x.Id == id);
        }

        public  async Task<Photo> GetMainPhotoForUser(int UserId)
        {
            return await _context.Photos.Where(x => x.UserId == UserId).FirstOrDefaultAsync(x => x.IsMain);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable(); // Get users from the Context but did not Execute it yet... toAsyncList is missing, execution is done in next step after filtration.
            
            users = users.Where(u => u.Id != userParams.UserId && u.Gender == userParams.Gender);

            if(userParams.MinAge != 18 ||  userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
                
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users , userParams.PageNumber , userParams.PageSize);
        }
    }
}