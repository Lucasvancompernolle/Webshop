using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{

    public class CustomerDto
    {

        public string custId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string street { get; set; }
        public int houseNumber { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public int postalCode { get; set; }
    }
}
