using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Orders
{
    public class OrderLine
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string InvoiceId { get; set; }
        public int LineNo { get; set; }
        public int ProdId { get; set; }
        public string Item { get; set; }
        public decimal QtyOrdered { get; set; }
        public decimal Price { get; set; }
        public bool Canceled { get; set; }
    }
}
