using API.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IOrderRepository
    {
        Order ConfirmOrder(string custId, IEnumerable<OrderLine> orderLines);
        IEnumerable<Order> GetOrders(int status);
        IEnumerable<OrderLine> GetOrderLinesCustomer(string custId);
        Order GetOrder(int ordId);
        IEnumerable<OrderLine> GetOrderLinesOrder(int ordId);
        IEnumerable<OrderLine> GetOpenOrderLinesOrder(int ordId);
        IEnumerable<OrderLine> GetClosedOrderLinesOrder(int ordId);
        Order CloseOrder(int ordId);
        Order OpenOrder(int ordId);
        OrderLine CloseOrderLine(int ordId, int lineNo);
        OrderLine ReopenOrderLine(int ordId, int lineNo);
        string GetInvoiceNumberFromOrder(int id);
       
    }
}
