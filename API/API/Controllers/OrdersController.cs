using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using API.Basket;
using API.Customers;
using API.Orders;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Nancy.Json;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customerRepository;

        public OrdersController(IOrderRepository orderRepository, ICustomerRepository customerRepository)
        {
            _orderRepository = orderRepository;
            _customerRepository = customerRepository;
        }
        // GET: api/<controller>
        [HttpGet]
        public ActionResult<IEnumerable<Order>> GetAllOrders()
        {
            IEnumerable<Order> orders = _orderRepository.GetOrders();
            return Ok(orders);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public ActionResult<IEnumerable<OrderLine>> GetOrderLines(int id)
        {
            var orderLines = _orderRepository.GetOrderLinesOrder(id);
            return Ok(orderLines);
        }

        [HttpGet("InvoiceOrder/{ordId}")]
        public ActionResult GetInvoiceOrder(int ordId)
        {
            var order = _orderRepository.GetOrder(ordId);
            var customer = _customerRepository.GetCustomer(order.CustId);
            List<OrderLine> orderLines = new List<OrderLine>(_orderRepository.GetOrderLinesOrder(ordId));

            string invoiceTemplate = ".\\Documents\\Invoices\\Template\\InvoiceTemplate.pdf";
            PdfCreator pdf = new PdfCreator(invoiceTemplate, customer, order, orderLines);
            string invoiceFile = pdf.CreateInvoiceForOrder();

            FileStream stream = new FileStream(invoiceFile, FileMode.Open);
            byte[] fileBytes = new byte[stream.Length];

            stream.Read(fileBytes, 0, fileBytes.Length);
            stream.Close();

            return File(
                 fileContents: fileBytes,
                 contentType: "application/pdf");
        }

        // POST api/<controller>
        [HttpPost("{custId}")]
        public ActionResult PlaceOrder(string custId, [FromBody] IEnumerable<BasketItem> basketItems)
        {
            List<OrderLine> orderLines = new List<OrderLine>();

            foreach (var item in basketItems)
            {
                OrderLine orderLine = new OrderLine();
                
                orderLine.ProdId = item.ProdId;
                orderLine.Item = item.ProductBrand;
                orderLine.QtyOrdered = item.Qty;
                orderLine.Price = item.Qty * item.Price;

                orderLines.Add(orderLine);
            }

            Order order = _orderRepository.ConfirmOrder(custId, orderLines);
            if (order.InvoiceId != "")
            {
                using (var message = new MailMessage())
                {
                    Customer customer = _customerRepository.GetCustomer(custId);
                                        
                    message.To.Add(new MailAddress(customer.EmailAddress, customer.Name));
                    message.From = new MailAddress("lucasvc55@gmail.com", "Food Webshop");
                    message.Subject = "Thanks for your order!";
                    message.Body = "Hello";
                    message.IsBodyHtml = true;

                    string invoiceTemplate = ".\\Documents\\Invoices\\Template\\InvoiceTemplate.pdf";
                    PdfCreator pdf = new PdfCreator(invoiceTemplate, customer, order, orderLines);
                    string invoiceDoc = pdf.CreateInvoiceForOrder();
                    Attachment attachment = new Attachment(invoiceDoc);
                    message.Attachments.Add(attachment);

                    using (var client = new SmtpClient("smtp.gmail.com"))
                    {
                        client.Port = 587;
                        client.Credentials = new NetworkCredential("lucasvc55@gmail.com", "700MB-80min");
                        client.EnableSsl = true;
                        client.Send(message);
                    }
                }

            }


            return Ok();
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }



        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
