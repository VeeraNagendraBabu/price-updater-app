using Microsoft.AspNetCore.SignalR;

namespace backend.Helper
{
    public class PriceHub : Hub
    {
        public async Task SubscribeToPriceUpdates()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "PriceSubscribers");
        }

        public async Task UnsubscribeFromPriceUpdates()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "PriceSubscribers");
        }
    }
}
