using API.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IOrderRepository
    {
        IEnumerable<Order> GetOrders();
        IEnumerable<OrderLine> GetOrderLinesOrder(int ordId);
        IEnumerable<OrderLine> GetOrderLinesCustomer(string custId);
        Order GetOrder(int ordId);
        Order ConfirmOrder(string custId, IEnumerable<OrderLine> orderLines);
        string GetInvoiceNumberFromOrder(int id);
        bool Save();
    }
}
