using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Basket;
using API.Orders;

namespace API.Services
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrderContext _orderContext;
        public OrderRepository(OrderContext orderContext)
        {

            _orderContext = orderContext;

        }
        public Order ConfirmOrder(string custId, IEnumerable<OrderLine> orderLines)
        {
            Order order = new Order();
            int orderSeq = _orderContext.Order.Where(o => o.OrderDate >= new DateTime(DateTime.Today.Year, 1, 1)).Count() + 1;
            order.InvoiceId =  orderSeq + "-" + DateTime.Now.ToString("yyyy");
            order.OrderDate = DateTime.Today;
            order.CustId = custId;

            int lineNumber = 1;
            foreach (var line in orderLines)
            {
                line.OrderId = orderSeq;
                line.InvoiceId = order.InvoiceId;
                line.LineNo = lineNumber;
                order.TotalPrice += line.Price * line.QtyOrdered;
                lineNumber++;
            }

            _orderContext.OrderLine.AddRange(orderLines);
            _orderContext.Order.Add(order);
            _orderContext.SaveChanges();

            return order;
            
        }

       

        public string GetInvoiceNumberFromOrder(int id)
        {
          return  _orderContext.Order.Where(o => o.OrderId == id).Single().InvoiceId;
        }

        public Order GetOrder(int ordId)
        {
            return _orderContext.Order.Where(o => o.OrderId == ordId).Single();
        }

        public Order GetOrder(string custId, IEnumerable<OrderLine> orderLines)
        {
            throw new NotImplementedException();
        }

        
        public IEnumerable<OrderLine> GetOrderLinesCustomer(string custId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<OrderLine> GetOrderLinesOrder(int ordId)
        {
            return _orderContext.OrderLine.Where(orderLine => orderLine.OrderId == ordId).ToList();
        }

        public IEnumerable<Order> GetOrders()
        {
            return _orderContext.Order.Where(order => order.ShippingDate < DateTime.Now.AddDays(-356)).ToList();
        }

        public bool Save()
        {
            throw new NotImplementedException();
        }
    }
}
