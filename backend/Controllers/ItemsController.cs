using backend.Helper;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace PriceUpdateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly ItemStore _itemStore;
    private readonly IHubContext<PriceHub> _hubContext;

    public ItemsController(ItemStore itemStore, IHubContext<PriceHub> hubContext)
    {
        _itemStore = itemStore;
        _hubContext = hubContext;
    }


    [HttpGet]
    public ActionResult<IEnumerable<Item>> GetAllItems()
    {
        return Ok(_itemStore.GetItems());
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateItems()
    {
        _itemStore.UpdateAllPrices();

        await _hubContext.Clients.Group("PriceSubscribers")
            .SendAsync("ReceivePriceUpdates", _itemStore.GetItems());

        return Ok(new { Message = "Prices updated and clients notified", Items = _itemStore.GetItems() });
    }
}

