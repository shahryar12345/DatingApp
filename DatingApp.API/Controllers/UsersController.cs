using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Data;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dtos;
using System.Collections.Generic;
using System.Security.Claims;
using DatingApp.API.Models;
using System;
using DatingApp.API.Helpers;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepositor _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepositor repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParam)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            var userFromRepo = await _repo.GetUser(currentUserId);
            
            userParam.UserId = currentUserId;

            if(string.IsNullOrEmpty(userParam.Gender))
            {
                userParam.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }
            
            var users = await _repo.GetUsers(userParam);
            var UserToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            Response.AddPagination(users.CurrentPage , users.PageSize , users.TotalCount , users.TotalPages);
            
            return Ok(UserToReturn);
        }

        [HttpGet("{id}" , Name="GetUser")] // Specify Name because We use CreatedAtRoute in AuthController
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var UserToReturn = _mapper.Map<UserForDetailDto>(user);
            return Ok(UserToReturn);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id , UserForUpdateDto userForUpdateDto)
        {
            // 'User' in below is represent the user which consume the API currently
            // Match id in URL with ID in Token  
        if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) 
            {
                return Unauthorized();
            }    
            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map( userForUpdateDto , userFromRepo);
            if(await _repo.SaveAll())
            {
                return NoContent();
            }
            throw new Exception($"Updating User {id} failed on save");
        }


        [HttpPost("{id}/like/{recipientId}")]

        public async Task<IActionResult> LikeUser (int id , int recipientId)
        {
          if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) 
            {
                return Unauthorized();
            }  

             var like = await _repo.GetLike(id  , recipientId);

             if(like != null)
             {
                 return BadRequest("You already like this user");
             }
             
             if(await _repo.GetUser(recipientId) == null)
             {
                 return NotFound();
             }

             like = new Like {
                 LikerId = id,
                 LikeeId = recipientId
             };

             _repo.Add<Like>(like);
            if(await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to like user");
        } 
    }
}