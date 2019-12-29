using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Customers;
using API.Customers.CustomerAddress;

namespace API.Services
{
    public class CustomerRepository : ICustomerRepository
    {

        private readonly CustomerContext _customerContext;
        public CustomerRepository(CustomerContext customerContext)
        {
            _customerContext = customerContext;
        }
        public void AddCustomer(Customer customer)
        {
            _customerContext.Add(customer);
            _customerContext.SaveChanges();
        }

        public void DeleteCustomer(string custId)
        {
            throw new NotImplementedException();
        }

        public Customer GetCustomer(string custId)
        {
            Customer customer;
            try
            {
                customer = _customerContext.Customer.First(p => p.LoginId == custId);
                customer.Address = _customerContext.Address.First(a => a.Id == customer.Id);

                return customer;
            }
            catch
            {
                return null;
            }

            
        }

        public bool Save()
        {
            return _customerContext.SaveChanges() > 0;
        }

        public Customer UpdateCustomer(Customer customer)
        {
            throw new NotImplementedException();
        }
    }
}
