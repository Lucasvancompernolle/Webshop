
using Microsoft.EntityFrameworkCore;

namespace API.Products
{
    public class ProductContext : DbContext
    {
      

            public ProductContext(DbContextOptions<ProductContext> options)
               : base(options)
            {

                Database.Migrate();

            }

            public DbSet<Product> Product { get; set; }

        }
    }

