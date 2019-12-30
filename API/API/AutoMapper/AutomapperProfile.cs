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


            CreateMap<CustomerDto, Customer>()
                .ForMember(dest => dest.LoginId, map => map.MapFrom(src => src.custId))
                .ForMember(dest => dest.Name, map => map.MapFrom(src => src.firstName))
                .ForMember(dest => dest.LastName, map => map.MapFrom(src => src.lastName))
                .ForMember(dest => dest.Address, map => map.MapFrom(src => new Address()
                { City = src.city, PostalCode = src.postalCode, Street = src.street, StreetNumber = src.houseNumber.ToString(), Country = src.country }))
                .ForMember(dest => dest.MobilePhone, map => map.MapFrom(src => src.phone))
                .ForMember(dest => dest.EmailAddress, map => map.MapFrom(src => src.email));

            CreateMap<Customer, CustomerDto>()
                .ForMember(dest => dest.custId, map => map.MapFrom(src => src.LoginId))
                .ForMember(dest => dest.firstName, map => map.MapFrom(src => src.Name))
                .ForMember(dest => dest.lastName, map => map.MapFrom(src => src.LastName))
                .ForMember(dest => dest.street, map => map.MapFrom(src => src.Address.Street))
                .ForMember(dest => dest.houseNumber, map => map.MapFrom(src => src.Address.StreetNumber))
                .ForMember(dest => dest.city, map => map.MapFrom(src => src.Address.City))
                .ForMember(dest => dest.postalCode, map => map.MapFrom(src => src.Address.PostalCode))
                .ForMember(dest => dest.country, map => map.MapFrom(src => src.Address.Country))
                .ForMember(dest => dest.phone, map => map.MapFrom(src => src.MobilePhone))
                .ForMember(dest => dest.email, map => map.MapFrom(src => src.EmailAddress));
           

        }
    }
}
