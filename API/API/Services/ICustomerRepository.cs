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
        void AddCustomer(Customer customer);
        void DeleteCustomer(string custId);
        Customer UpdateCustomer(Customer customer);
        bool Save();
    }
}
