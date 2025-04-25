using backend.Helper;
using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers
{
    public class PriceUpdateService : BackgroundService
    {
        private readonly IHubContext<PriceHub> _hubContext;
        private readonly ItemStore _itemStore;

        public PriceUpdateService(IHubContext<PriceHub> hubContext, ItemStore itemStore)
        {
            _hubContext = hubContext;
            _itemStore = itemStore;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _itemStore.UpdateAllPrices();

                await _hubContext.Clients.Group("PriceSubscribers")
                    .SendAsync("ReceivePriceUpdates", _itemStore.GetItems());

                await Task.Delay(1000, stoppingToken);
            }
        }
    }

}
