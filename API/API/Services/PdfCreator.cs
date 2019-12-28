using API.Customers;
using API.Orders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Parsing;
using System;
using iTextSharp.text.pdf;
using System.Collections;
using iTextSharp.text;

namespace API.Services
{
    public class PdfCreator
    {

        private Stream _template { get; set; }
        private Stream _outputFile { get; set; }
        private Customer _customer { get; set; }
        private List<OrderLine> _orderLines { get; set; }
        private Order _order { get; set; }

        public PdfCreator(string template,
                          Customer cust, Order order, List<OrderLine> orderLines)
        {
            _template = new FileStream(template, FileMode.Open, FileAccess.Read, FileShare.Read);
            _outputFile = new FileStream(".\\Documents\\Invoices\\" + order.InvoiceId + ".pdf", FileMode.Create);
            _customer = cust;
            _order = order;
            _orderLines = orderLines;
        }

        public string CreateInvoiceForOrder()
        {
           
            
            // build in checks....

            PdfReader pdfReader = null;
            PdfStamper pdfStamper = null;
            try
            {
                pdfReader = new PdfReader(_template);
                pdfStamper = new PdfStamper(pdfReader, _outputFile);

                AcroFields form = pdfStamper.AcroFields;

                // Company address
                form.SetField("Company Name", "Food shop NV");
                form.SetField("Email Address", "lucasvc55@gmail.com");
                form.SetField("Address 1", "Teststraat 11, 9000 Gent");
                form.SetField("Address 2", "+32 484/26.23.55");
                // Client address
                form.SetField("Client Name", _customer.Name + " " + _customer.LastName);
                form.SetField("Client Email Address", _customer.EmailAddress);
                form.SetField("Client Address 1", _customer.Address.Street + " " + _customer.Address.StreetNumber);
                form.SetField("Client Address 2", _customer.Address.PostalCode + " " + _customer.Address.City);
                // Order data
                form.SetField("Due Date", DateTime.Today.ToString("dd/MM/yyyy"));
                form.SetField("Date", DateTime.Today.ToString("dd/MM/yyyy"));
                form.SetField("Invoice Number", _order.InvoiceId);

                for (int i = 1; i < (_orderLines.Count + 1); i++)
                {
                    form.SetField("Item Description Row " + i, _orderLines[i - 1].Item);
                    form.SetField("Quantity Row " + i, "st " + _orderLines[i - 1].QtyOrdered.ToString());
                    form.SetField("Price Row " + i, "€ " + Math.Round(_orderLines[i - 1].Price, 2).ToString());
                    form.SetField("Amount Row " + i, "€ " + Math.Round(_orderLines[i - 1].Price * _orderLines[i - 1].QtyOrdered, 2).ToString());
                }

                form.SetField("Amount_5", "€ " + Math.Round(_order.TotalPrice, 2).ToString());
                form.SetField("Amount_6", "% 6");
                form.SetField("Amount_7", "€ " + Math.Round(_order.TotalPrice * 1.06M, 2).ToString());

                form.SetField("Notes", "Thanks for your order!");

            }
            finally
            {
                pdfStamper?.Close();
                pdfReader?.Close();
                _template?.Close();
                _outputFile?.Close();
            }

            return (_outputFile as FileStream).Name;
        }


    }
}
