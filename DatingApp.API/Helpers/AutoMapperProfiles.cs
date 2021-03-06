using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // First register mapping here which we are going to use in over application
            CreateMap<User , UserForListDto>() //User to UserForListDto
                .ForMember(dest => dest.PhotoUrl , 
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age , opt => opt.ResolveUsing(d => d.DateOfBirth.CalculateAge()));
            CreateMap<User , UserForDetailDto>() //User to UserForDetailDto   
                .ForMember(dest => dest.PhotoUrl , 
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))      
                .ForMember(dest => dest.Age , opt => opt.ResolveUsing(d => d.DateOfBirth.CalculateAge()));
            
            CreateMap<Photo , PhotosForDetailDto>(); //User to UserForDetailDto          
            CreateMap<UserForUpdateDto , User>();

            CreateMap<Photo , PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto , Photo>();
            CreateMap<UserForRegisterDtos , User>();
            
            CreateMap<MessageForCreatingDto , Message>();
            
            CreateMap<Message , MessageForCreatingDto >()
            .ForMember(dest => dest.SenderPhotoUrl , opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl , opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
            

            CreateMap<Message , MessageToReturnDto>()
            .ForMember(dest => dest.senderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
            
        }
    }
}