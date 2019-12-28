using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Products;

namespace API.Services
{
    public interface IProductRepository
    {
        IEnumerable<Product> GetProducts();
        Product GetProduct(int id);
        void AddProduct(Product product);
        void AddMultipleProducts(IEnumerable<Product> products);
        void DeleteProduct(int id);
        void UpdateProduct(Product product);

    }
}
