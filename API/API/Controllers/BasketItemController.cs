using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using API.Basket;
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

        public BasketItemController(IBasketItemRepository basketItemRepository)
        {
            _basketItemRepository = basketItemRepository;
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

        //// GET: api/BasketItem/5
        //[HttpGet("{id}", Name = "Get")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST: api/BasketItem

        [HttpPost]
        public IActionResult AddBasketItems([FromBody] IEnumerable<BasketItem> basketItems)
        {

            if (basketItems == null)
            {
                return BadRequest();
            }

            foreach (var item in basketItems)
            {
                _basketItemRepository.AddBasketItem(item);
            }

            if (!_basketItemRepository.Save())
            {
                return BadRequest();
            }

            return Ok(basketItems);
           
        }
     

        // PUT: api/BasketItem/5
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
