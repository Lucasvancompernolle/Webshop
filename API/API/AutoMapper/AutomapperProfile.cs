using API.Customers;
using API.Customers.CustomerAddress;
using API.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.AutoMapper
{
    public class AutomapperProfile : Profile
    {
        public AutomapperProfile()
        {
            CreateMap<Customer, CustomerDto>().ReverseMap();

            CreateMap<CustomerDto, Customer>()
                .ForMember(dest => dest.LoginId, map => map.MapFrom(src => src.custId))
                .ForMember(dest => dest.Name, map => map.MapFrom(src => src.firstName))
                .ForMember(dest => dest.LastName, map => map.MapFrom(src => src.lastName))
                .ForMember(dest => dest.Address, map => map.MapFrom(src => new Address()
                { City = src.city, PostalCode = src.postalCode, Street = src.street, StreetNumber = src.houseNumber.ToString(), Country = src.country }))
                .ForMember(dest => dest.MobilePhone, map => map.MapFrom(src => src.phone))
                .ForMember(dest => dest.EmailAddress, map => map.MapFrom(src => src.email));

            

        }
    }
}
