using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Basket
{
    public class BasketItem
    {
        public int Id { get; set; }
        public int ProdId { get; set; }
        public string ProductBrand { get; set; }
        public decimal Qty { get; set; }
        public decimal Price { get; set; }
        public bool Closed { get; set; }

        public string CustNumber { get; set; }
    }
}
