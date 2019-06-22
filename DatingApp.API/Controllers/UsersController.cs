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

namespace DatingApp.API.Controllers
{
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
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var UserToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
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
    }
}