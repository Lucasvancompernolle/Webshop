using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Basket;

namespace API.Services
{
    public class BasketItemRepository : IBasketItemRepository
    {
        private readonly BasketItemContext _basketItemContext;
        public BasketItemRepository(BasketItemContext basketItemContext)
        {
            _basketItemContext = basketItemContext;
        }
        public void AddBasketItem(BasketItem item)
        {
            BasketItem inBasket = _basketItemContext.BasketItems.Where(a => a.ProdId == item.ProdId && a.CustNumber == item.CustNumber && a.Closed == false).FirstOrDefault();
            if (inBasket != null)
            {
                inBasket.Qty += item.Qty;
                _basketItemContext.BasketItems.Update(inBasket);
            }
            else
            {
                _basketItemContext.BasketItems.Add(item);
            }
        }

        public void AddMultipleBasketItems(IEnumerable<BasketItem> Items)
        {
            foreach (var item in Items)
            {
                _basketItemContext.BasketItems.Add(item);
            }

        }

        public void DeleteBasketItem(int id)
        {
            BasketItem item = _basketItemContext.BasketItems.Where(a => a.Id == id).Single();
            _basketItemContext.BasketItems.Remove(item);
            _basketItemContext.SaveChanges();

        }

        public IEnumerable<BasketItem> GetBasketforCustomerOpen(string custId)
        {
            return _basketItemContext.BasketItems.Where(a => a.CustNumber == custId && a.Closed == false).ToList();
        }

        public IEnumerable<BasketItem> GetBasketforCustomerClosed(string custId)
        {
            return _basketItemContext.BasketItems.Where(a => a.CustNumber == custId && a.Closed == false).ToList();
        }

        public BasketItem GetBasketItem(int id)
        {
            return _basketItemContext.BasketItems.Where(a => a.Id == id).SingleOrDefault();
        }

        public void UpdateBasketItem(BasketItem item)
        {
            throw new NotImplementedException();
        }

        public bool Save()
        {
            return (_basketItemContext.SaveChanges() >= 0);
        }

        public void UpdateMultipleBasketItems(IEnumerable<BasketItem> Items)
        {
            _basketItemContext.UpdateRange(Items);
            _basketItemContext.SaveChanges();
        }
    }
}
