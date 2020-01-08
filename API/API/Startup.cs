using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Products;
using API.Services;
using API.Basket;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using API.Customers;
using AutoMapper;
using API.Models;
using API.AutoMapper;
using API.Orders;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddCors();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            var connectionString = Configuration["connectionStrings:MasterDBConnectionString"];
            services.AddDbContext<ProductContext>(o => o.UseSqlServer(connectionString));

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutomapperProfile());
            });

            IMapper mapper = config.CreateMapper();
            services.AddSingleton(mapper);

            // register the repository
            services.AddScoped<IProductRepository, ProductRepository>();

            services.AddDbContext<BasketItemContext>(o => o.UseSqlServer(connectionString));
            services.AddScoped<IBasketItemRepository, BasketItemRepository>().AddScoped<IProductRepository, ProductRepository>();

            services.AddDbContext<CustomerContext>(o => o.UseSqlServer(connectionString));
            services.AddScoped<ICustomerRepository, CustomerRepository>();

            services.AddDbContext<OrderContext>(o => o.UseSqlServer(connectionString));
            services.AddScoped<IOrderRepository, OrderRepository>().AddScoped<ICustomerRepository, CustomerRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
               
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

           
            

            app.UseCors(options =>
          options.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
