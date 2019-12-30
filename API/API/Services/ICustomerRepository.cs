using API.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface ICustomerRepository
    {

        Customer GetCustomer(string custId);
        IEnumerable<Customer> getCustomers();
        bool AddCustomer(Customer customer);
        bool DeleteCustomer(string custId);
        Customer UpdateCustomer(Customer customer);
        bool Save();
    }
}
