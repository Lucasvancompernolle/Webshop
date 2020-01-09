using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Orders
{
    public class Order
    {
        public int OrderId { get; set; }
        public string InvoiceId { get; set; }
        public string CustId { get; set; }
        public bool Payed { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime ShippingDate { get; set; }
        public int Status { get; set; } // 1 = open, 99 = closed



    }
}
