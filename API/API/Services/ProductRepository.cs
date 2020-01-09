using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Products;

namespace API.Services
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductContext _context;
        public ProductRepository(ProductContext context)
        {
            _context = context;
        }

        public void AddMultipleProducts(IEnumerable<Product> products)
        {

            foreach (var product in products)
            {
                
                if (_context.Product.Count(p => p.Id == product.Id) > 0)
                {
                    
                    _context.Product.Update(product);
                   
                }
                else
                {
                    product.Id = 0;
                    _context.Product.Add(product);
                }
            }
            
            _context.SaveChanges();
        }

        public void AddProduct(Product product)
        {
            _context.Product.Add(product);
            _context.SaveChanges();
        }

        public void DeleteProduct(int id)
        {
            var product = _context.Product.Where(p => p.Id == id).FirstOrDefault();
            _context.Product.Remove(product);
            _context.SaveChanges();

        }

        public Product GetProduct(int id)
        {
            return _context.Product.Where(p => p.Id == id).FirstOrDefault();
        }

        public IEnumerable<Product> GetProducts()
        {
            return _context.Product
                  .Where(p => p.Id != 0)
                  .OrderBy(a => a.Brand)
                  .ThenBy(a => a.ProductGroup)
                  .ToList();
        }

        public void UpdateProduct(Product updProduct)
        {

            _context.Product.Update(updProduct);
            _context.SaveChanges();
        }
    }

}
