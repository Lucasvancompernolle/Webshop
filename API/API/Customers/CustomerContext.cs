using API.Customers.CustomerAddress;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Customers
{
    public class CustomerContext : DbContext
    {
        public CustomerContext(DbContextOptions<CustomerContext> options)
              : base(options)
        {
            Database.Migrate();

        }

        public DbSet<Customer> Customer { get; set; }
        public DbSet<Address> Address { get; set; }
    }
}
