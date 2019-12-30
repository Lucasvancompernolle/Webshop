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
        public bool AddCustomer(Customer customer)
        {
            Customer customerExist;
            try
            {
                customerExist = _customerContext.Customer.First(p => p.EmailAddress == customer.EmailAddress);

                if (customerExist != null)
                {
                    customer.Id = customerExist.Id;
                    _customerContext.Update(customer);

                }


                else
                    _customerContext.Add(customer);

                return _customerContext.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteCustomer(string custId)
        {
            Customer customer;
            try
            {
                customer = _customerContext.Customer.First(p => p.LoginId == custId);
                _customerContext.Remove(customer);
                return _customerContext.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }


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

        public IEnumerable<Customer> getCustomers()
        {
            List<Customer> customers = _customerContext.Customer.Where(p => p.Id != 0)
                                                                 .ToList();

            foreach (var cust in customers)
            {
                cust.Address = _customerContext.Address.First(a => a.Id == cust.Id);
            }

            return customers;
        }

        public bool Save()
        {
            return _customerContext.SaveChanges() > 0;
        }

        public Customer UpdateCustomer(Customer customer)
        {
            _customerContext.Update(customer);

            return customer;


        }


    }
}
