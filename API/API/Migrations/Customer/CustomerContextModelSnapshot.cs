﻿// <auto-generated />
using System;
using API.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Migrations.Customer
{
    [DbContext(typeof(CustomerContext))]
    partial class CustomerContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("API.Customers.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AddrId");

                    b.Property<DateTime>("Birth");

                    b.Property<string>("EmailAddress");

                    b.Property<string>("LastName");

                    b.Property<string>("LoginId");

                    b.Property<string>("MobilePhone");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("AddrId");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("API.Customers.CustomerAddress.Address", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("City");

                    b.Property<string>("Country");

                    b.Property<int>("PostalCode");

                    b.Property<string>("Street");

                    b.Property<string>("StreetNumber");

                    b.HasKey("Id");

                    b.ToTable("Address");
                });

            modelBuilder.Entity("API.Customers.Customer", b =>
                {
                    b.HasOne("API.Customers.CustomerAddress.Address", "Address")
                        .WithMany()
                        .HasForeignKey("AddrId");
                });
#pragma warning restore 612, 618
        }
    }
}
