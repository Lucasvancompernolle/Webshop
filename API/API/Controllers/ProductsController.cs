using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using API.Products;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Drawing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Text;
using System.IO;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private readonly IProductRepository _productRepository;
        private readonly IHostingEnvironment _hostingEnvironment;

        public ProductsController(IProductRepository productRepository, IHostingEnvironment hostingEnvironment)
        {
            _productRepository = productRepository;
            this._hostingEnvironment = hostingEnvironment;
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<Product>> Get()
        {
            var productsFromRepo = _productRepository.GetProducts();

            return Ok(productsFromRepo);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            var productFromRepo = _productRepository.GetProduct(id);

            return Ok(productFromRepo);
        }

        // POST api/values
        [HttpPost]
        public ActionResult<Product> Post([FromBody] Product product)
        {

            _productRepository.AddProduct(product);

            return Ok(product);
        }

        [HttpPost("list")]
        public ActionResult<IEnumerable<Product>> Post([FromBody] IEnumerable<Product> products)
        {

            _productRepository.AddMultipleProducts(products);

            return Ok(products);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public ActionResult<Product> Put(int id, [FromBody] Product product)
        {
            product.Id = id;
            _productRepository.UpdateProduct(product);
            return product;
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _productRepository.DeleteProduct(id);
            return Ok();
        }

        [HttpPost("UploadExcel")]
        public ActionResult UploadProductsExcel()
        {
            return Ok();
        }


        [HttpGet("DownloadExcel")]
        public ActionResult GetProductsExcel()
        {
            byte[] fileContents;
            IEnumerable<Product> products = _productRepository.GetProducts();

            if (products.Count() == 0)
                return StatusCode(204);

            ExcelPackage pck = new ExcelPackage();
            ExcelWorksheet ws = pck.Workbook.Worksheets.Add("Products");

            ws.Cells["A1"].Value = "Date";
            ws.Cells["B1"].Value = string.Format("{0:dd MMMM yyyy} at {0:H: mm tt}", DateTimeOffset.Now);

            ws.Cells["A3"].Value = "Id";
            ws.Cells["B3"].Value = "Name";
            ws.Cells["C3"].Value = "Brand";
            ws.Cells["D3"].Value = "Price";
            ws.Cells["E3"].Value = "SalesUnit";
            ws.Cells["F3"].Value = "RatingScore";
            ws.Cells["G3"].Value = "QtyOnHand";
            ws.Cells["H3"].Value = "ProductGroup";
            ws.Cells["I3"].Value = "Sku";
            ws.Cells["J3"].Value = "Description";
            ws.Cells["K3"].Value = "PicturePath";
            ws.Cells["L3"].Value = "Country of origin";


            ws.Cells["A3:L3"].AutoFitColumns();
            ws.Cells["A3:L3"].Style.Font.Bold = true;

            var sortedListProducts = from item in products
                                     orderby item.Id ascending
                                     select item;

            int rowStart = 4;

            foreach (var item in sortedListProducts)
            {
                if (item.QtyOnHand <= 4)
                {
                    ws.Cells[string.Format("A{0}:L{0}", rowStart)].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    ws.Cells[string.Format("A{0}:L{0}", rowStart)].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(string.Format("red")));

                }

                ws.Cells[string.Format("A{0}", rowStart)].Value = item.Id;
                ws.Cells[string.Format("B{0}", rowStart)].Value = item.Name;
                ws.Cells[string.Format("C{0}", rowStart)].Value = item.Brand;
                ws.Cells[string.Format("D{0}", rowStart)].Value = item.Price;
                ws.Cells[string.Format("E{0}", rowStart)].Value = item.SalesUnit;
                ws.Cells[string.Format("F{0}", rowStart)].Value = item.RatingScore;
                ws.Cells[string.Format("G{0}", rowStart)].Value = item.QtyOnHand;
                ws.Cells[string.Format("H{0}", rowStart)].Value = item.ProductGroup;
                ws.Cells[string.Format("I{0}", rowStart)].Value = item.Sku;
                ws.Cells[string.Format("J{0}", rowStart)].Value = item.Description;
                ws.Cells[string.Format("K{0}", rowStart)].Value = item.PicturePath;
                ws.Cells[string.Format("L{0}", rowStart)].Value = item.CountryOfOrigin;
                rowStart++;
            }

            fileContents = pck.GetAsByteArray();


            if (fileContents == null || fileContents.Length == 0)
            {
                return NotFound(400);
            }

            return File(
                fileContents: fileContents,
                contentType: "application/ms-excel");

        }


    }
}
