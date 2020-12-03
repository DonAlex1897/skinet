using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basket;

        public BasketController(IBasketRepository basket)
        {
            _basket = basket;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string Id)
        {
            var basket = await _basket.GetBasketAsync(Id);

            return Ok(basket ?? new CustomerBasket(Id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updateBasket = await _basket.UpdateBasketAsync(basket);

            return Ok(updateBasket);
        }

        [HttpDelete]
        public async Task DeleteBasket(string Id)
        {
            await _basket.DeleteBasketAsync(Id);
        }
    }
}
