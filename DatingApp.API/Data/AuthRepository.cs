using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user  = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName  == username );
            if(user == null)
            {
                return null;
            }
            
            if(!VarifyPasswordhash(password , user.PasswordHash , user.PasswordSalt))
            {
                return null;
            }
            return user;
        }

        private bool VarifyPasswordhash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
             using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedhash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i = 0 ; i < computedhash.Length ;i++)
                {
                    if(computedhash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;
            }
        }

        public async Task<User> Register(User user, string password)
        {
             byte[] passwordHash ,   passwordSalt;
             CreatepasswordHash(password , out passwordHash , out passwordSalt);
             user.PasswordHash = passwordHash;
             user.PasswordSalt = passwordSalt;

             await _context.Users.AddAsync(user);
             await _context.SaveChangesAsync();

             return user;
        }

        private void CreatepasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // Hashing is different from encryption , it can not use any key for generation , and is can not 
            // reverse only. 
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            } 
        }

        public async Task<bool> UserExists(string username)
        {
            if(await _context.Users.AnyAsync(x => x.UserName == username))
            {
                return true;
            }
            return false;
        }
    }
}