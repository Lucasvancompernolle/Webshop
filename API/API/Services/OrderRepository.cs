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
            order.InvoiceId = orderSeq + "-" + DateTime.Now.ToString("yyyy");
            order.OrderDate = DateTime.Today;
            order.CustId = custId;
            order.Status = 1;

            int lineNumber = 1;
            foreach (var line in orderLines)
            {
                line.OrderId = orderSeq;
                line.InvoiceId = order.InvoiceId;
                line.LineNo = lineNumber;
                line.Status = 1;
                order.TotalPrice += line.Price * line.QtyOrdered;
                lineNumber++;
            }

            _orderContext.OrderLine.AddRange(orderLines);
            _orderContext.Order.Add(order);
            _orderContext.SaveChanges();

            return order;

        }

        public IEnumerable<Order> GetOrders(int status)
        {
            return _orderContext.Order.Where(o => o.Status == status).ToList();
        }


        public IEnumerable<OrderLine> GetOrderLinesCustomer(string custId)
        {
            List<OrderLine> orderLinesCust = new List<OrderLine>();
            List<Order> orderCustomer = _orderContext.Order.Where(o => o.CustId == custId).ToList();

            foreach (var order in orderCustomer)
            {
                orderLinesCust.AddRange(_orderContext.OrderLine.Where(o => o.InvoiceId == order.InvoiceId && o.Status != 99).ToList());

            }

            return orderLinesCust;


        }
        public string GetInvoiceNumberFromOrder(int id)
        {
            return _orderContext.Order.Where(o => o.OrderId == id).Single().InvoiceId;
        }

        public Order GetOrder(int ordId)
        {
            return _orderContext.Order.Where(o => o.OrderId == ordId).Single();
        }
        public IEnumerable<OrderLine> GetOrderLinesOrder(int ordId)
        {
            return _orderContext.OrderLine.Where(orderLine => orderLine.OrderId == ordId).ToList();
        }

        public IEnumerable<OrderLine> GetOpenOrderLinesOrder(int ordId)
        {
            return _orderContext.OrderLine.Where(orderLine => orderLine.OrderId == ordId && orderLine.Status == 1).ToList();
        }

        public IEnumerable<OrderLine> GetClosedOrderLinesOrder(int ordId)
        {
            return _orderContext.OrderLine.Where(orderLine => orderLine.OrderId == ordId && orderLine.Status == 99).ToList();
        }


        public Order CloseOrder(int ordId)
        {
            Order order = _orderContext.Order.Where(o => o.OrderId == ordId).FirstOrDefault();

            order.Status = 99;
            order.ShippingDate = DateTime.Now;

            List<OrderLine> orderLines = _orderContext.OrderLine.Where(o => o.InvoiceId == order.InvoiceId && o.Status == 1).ToList();

            foreach (var line in orderLines)
            {
                line.Status = 99;
            }

            _orderContext.Order.Update(order);
            _orderContext.OrderLine.UpdateRange(orderLines);

            _orderContext.SaveChanges();

            return order;

        }

        public Order OpenOrder(int ordId)
        {
            Order order = _orderContext.Order.Where(o => o.OrderId == ordId).FirstOrDefault();

            order.Status = 1;
            order.ShippingDate = DateTime.Now;

            List<OrderLine> orderLines = _orderContext.OrderLine.Where(o => o.InvoiceId == order.InvoiceId && o.Status == 99).ToList();

            foreach (var line in orderLines)
            {
                line.Status = 1;
            }

            _orderContext.Order.Update(order);
            _orderContext.OrderLine.UpdateRange(orderLines);

            _orderContext.SaveChanges();

            return order;

        }

        public OrderLine CloseOrderLine(int ordId, int lineNo)
        {
            OrderLine line = _orderContext.OrderLine.Where(l => l.OrderId == ordId && l.LineNo == lineNo).FirstOrDefault();
            line.Status = 99;
            _orderContext.OrderLine.Update(line);
            _orderContext.SaveChanges();

            bool lastOrderLine = _orderContext.OrderLine.Where(l => l.OrderId == ordId && l.Status == 1).FirstOrDefault() == null;
            if (lastOrderLine == true)
            {
                Order order = _orderContext.Order.Where(o => o.OrderId == ordId).FirstOrDefault();
                order.Status = 99;
                _orderContext.Order.Update(order);

                _orderContext.SaveChanges();

            }

            return line;
        }

        public OrderLine ReopenOrderLine(int ordId, int lineNo)
        {
            OrderLine line = _orderContext.OrderLine.Where(l => l.OrderId == ordId && l.LineNo == lineNo).FirstOrDefault();
            line.Status = 1;
            _orderContext.OrderLine.Update(line);

            Order order = _orderContext.Order.Where(o => o.OrderId == ordId).FirstOrDefault();
            order.Status = 1;
            _orderContext.Order.Update(order);

            _orderContext.SaveChanges();
            return line;
        }
    }
}
