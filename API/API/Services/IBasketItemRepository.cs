using API.Basket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IBasketItemRepository
    {
        IEnumerable<BasketItem> GetBasketforCustomerOpen(string custId);
        IEnumerable<BasketItem> GetBasketforCustomerClosed(string custId);
        BasketItem GetBasketItem(int id);
        void AddBasketItem(BasketItem item);
        void AddMultipleBasketItems(IEnumerable<BasketItem> Items);
        void UpdateMultipleBasketItems(IEnumerable<BasketItem> Items);
        void DeleteBasketItem(int id);
        void UpdateBasketItem(BasketItem item);
        bool Save();
    }
}
