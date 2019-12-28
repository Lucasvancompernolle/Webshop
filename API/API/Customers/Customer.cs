using API.Customers.CustomerAddress;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace API.Customers
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        public string LoginId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        [ForeignKey("AddrId")]
        public Address Address { get; set; }
        public string MobilePhone { get; set; }
        public string EmailAddress { get; set; }
        public DateTime Birth { get; set; } 

    }
}
