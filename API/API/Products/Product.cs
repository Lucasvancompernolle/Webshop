using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Products
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Sku { get; set; }
        public string Description { get; set; }
        public string PicturePath { get; set; }
        public string CountryOfOrigin { get; set; }
        public string ProductGroup { get; set; }
        public decimal Price { get; set; }
        public decimal QtyOnHand { get; set; }
        public string SalesUnit { get; set; }
        public int RatingScore { get; set; }
    }
}


