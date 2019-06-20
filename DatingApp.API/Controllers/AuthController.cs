using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo,
         IConfiguration config,
         IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDtos userForRegisterDtos )
        {
            // validate Request
            userForRegisterDtos.Username = userForRegisterDtos.Username.ToLower();
            if(await _repo.UserExists(userForRegisterDtos.Username))
            { 
                return BadRequest("User Already Exists");
            }
            var userToCreate = new User {
             UserName = userForRegisterDtos.Username   
            };
            var Createduser = await _repo.Register(userToCreate , userForRegisterDtos.Password);
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            //throw new Exception("Computer Says No..");
            var userFormRepo = await _repo.Login(userForLoginDto.Username.ToLower(),userForLoginDto.Password);

            if(userFormRepo == null)
            {
                return Unauthorized("User is Unauthorized");
            }

            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier , userFormRepo.Id.ToString()),
                new Claim(ClaimTypes.Name , userFormRepo.UserName)         
            };
            // Token is Generated From a Key because its Encryption Process , it can be decrypted.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key , SecurityAlgorithms.HmacSha512Signature);
            
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            var user = _mapper.Map<UserForListDto>(userFormRepo);
            
            // Returning anonymous 
            return Ok(new {
                token = tokenHandler.WriteToken(token),
                user 
            });
        }
    }
}