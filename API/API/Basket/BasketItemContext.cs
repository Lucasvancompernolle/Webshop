using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Basket
{
    public class BasketItemContext : DbContext
    {
        public BasketItemContext(DbContextOptions<BasketItemContext> options)
              : base(options)
        {
            Database.Migrate();

        }

        public DbSet<BasketItem> BasketItems { get; set; }
    }
}
