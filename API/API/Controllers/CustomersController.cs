using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Customers;
using API.Services;
using API.Models;
using AutoMapper;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        public CustomersController(ICustomerRepository customerRepository, IMapper mapper)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
        }

       
        // GET: api/Customers/5
        [HttpGet("{uid}")]
        public ActionResult<Customer> GetCustomer(string uid)
        { 
            
            var customer =  _customerRepository.GetCustomer(uid);
            var mappedCustomer = _mapper.Map<CustomerDto>(customer);

           
            return Ok(mappedCustomer);
        }

        [HttpGet]
        public ActionResult<Customer> GetCustomers()
        {

            var customers = _customerRepository.getCustomers();

            var mappedCustomers = new List<CustomerDto>();

            foreach (var cust in customers)
            {
                mappedCustomers.Add(_mapper.Map<CustomerDto>(cust));
            }

            if (mappedCustomers == null)
            {
                return NotFound();
            }

            return Ok(mappedCustomers);
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public ActionResult PutCustomer(string id, CustomerDto customerDto)
        {
            var mappedCustomer = _mapper.Map<Customer>(customerDto);

            if (id != mappedCustomer.LoginId)
            {
                return BadRequest();
            }

            try
            {
                _customerRepository.UpdateCustomer(mappedCustomer);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                   return NoContent();
                }
            }

            return Ok(mappedCustomer);
        }

        // POST: api/Customers
        [HttpPost]
        public ActionResult<Customer> PostCustomer([FromBody] CustomerDto customerDto)
        {
            var mappedCustomer = _mapper.Map<Customer>(customerDto); 
           
              _customerRepository.AddCustomer(mappedCustomer);

            return Ok(customerDto);
          
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public  ActionResult DeleteCustomer(string id)
        {
           
            _customerRepository.DeleteCustomer(id);
            

            return Ok(_customerRepository.DeleteCustomer(id));
        }

        private bool CustomerExists(string id)
        {
            return _customerRepository.GetCustomer(id) != null;
        }
    }
}
