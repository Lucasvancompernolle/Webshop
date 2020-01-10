using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Basket;
using API.Products;
using API.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BasketItemController : ControllerBase
    {
        private readonly IBasketItemRepository _basketItemRepository;
        private readonly IProductRepository _productRepository;

        public BasketItemController(IBasketItemRepository basketItemRepository, IProductRepository productRepository)
        {
            _basketItemRepository = basketItemRepository;
            _productRepository = productRepository;
        }

        [HttpOptions]
        public HttpResponseMessage Options()
        {
            var response = new HttpResponseMessage();
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        // GET: api/BasketItem
        [HttpGet("{custid}")]
        public ActionResult<IEnumerable<BasketItem>> Get(string custid)
        {
            IEnumerable<BasketItem> basketItems = _basketItemRepository.GetBasketforCustomerOpen(custid);
            return Ok(basketItems);
        }

        [HttpPost]
        public IActionResult AddBasketItem([FromBody] BasketItem basketItem)
        {

            if (basketItem == null)
            {
                return BadRequest();
            }

            _basketItemRepository.AddBasketItem(basketItem);


            if (!_basketItemRepository.Save())
            {
                return BadRequest();
            }

            return Ok(basketItem);

        }


        // PUT: api/BasketItem
        [HttpPut]
        public ActionResult UpdateMultipleBasketItems([FromBody] IEnumerable<BasketItem> basketItems)
        {
            _basketItemRepository.UpdateMultipleBasketItems(basketItems);
            return Ok();
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
          
            _basketItemRepository.DeleteBasketItem(id);
            _basketItemRepository.Save();

            return Ok();
        }
    }
}
