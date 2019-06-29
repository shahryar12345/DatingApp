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


            if(userParams.Likers)
            {
                var UserLikers = await GetUserLikes(userParams.UserId , userParams.Likers);
                users = users.Where(u => UserLikers.Contains(u.Id));
            }

            if(userParams.Likees)
            {
                var UserLikees = await GetUserLikes(userParams.UserId , userParams.Likers);
                users = users.Where(u => UserLikees.Contains(u.Id));
            }

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
        

        private async Task<IEnumerable<int>> GetUserLikes (int id , bool likers)
        {
            var user = await _context.Users
            .Include(x => x.Likers)
            .Include(x => x.Likees)
            .FirstOrDefaultAsync(u => u.Id == id);

            if(likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }

        }
        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
        return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }


        public async Task<IEnumerable<Message>> GetMesssageThread(int userId, int recipientId)
        {
            var message =  await _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).Include(u => u.Recipient).ThenInclude(p =>p.Photos)
            .Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId ||
            m.RecipientId == recipientId && m.SenderDeleted == false && m.SenderId == userId)
            .OrderByDescending(m => m.MessageSent).
            ToListAsync();

            return message;
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var message = _context.Messages.Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).Include(u => u.Recipient).ThenInclude(p =>p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    message = message.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    message = message.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default:
                    message = message.Where(u => u.RecipientId == messageParams.UserId && u.IsRead == false && u.RecipientDeleted == false);
                    break;
            }

            message = message.OrderByDescending(d => d.MessageSent);

            return await PagedList<Message>.CreateAsync(message , messageParams.PageNumber , messageParams.PageSize);

        }
    }
}