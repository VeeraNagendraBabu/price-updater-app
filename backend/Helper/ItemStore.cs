using backend.Models;

namespace backend.Helper
{
    public class ItemStore
    {
        private readonly List<Item> _items;
        private readonly Random _random = new();

        public ItemStore()
        {
            _items = new()
        {
            new Item { Id = Guid.NewGuid(), Name = "Apple", Price = 100 },
            new Item { Id = Guid.NewGuid(), Name = "Banana", Price = 50 },
            new Item { Id = Guid.NewGuid(), Name = "Carrot", Price = 80 },
            new Item { Id = Guid.NewGuid(), Name = "Papaya", Price = 100 },
            new Item { Id = Guid.NewGuid(), Name = "Cherry", Price = 50 },
            new Item { Id = Guid.NewGuid(), Name = "Litchy", Price = 80 },
            // Add up to 10 items
        };
        }

        public IEnumerable<Item> GetItems() => _items;

        public void UpdateAllPrices()
        {
            foreach (var item in _items)
            {
                var oldPrice = item.Price;
                var change = (decimal)(_random.NextDouble() * 0.1 - 0.05); // -5% to +5%
                item.Price += item.Price * change;
                item.Price = Math.Round(item.Price, 2);
                item.UpdatedAt = DateTime.UtcNow;
                item.PriceChange = item.Price > oldPrice ? PriceDirection.Up :
                                   item.Price < oldPrice ? PriceDirection.Down :
                                   PriceDirection.None;
            }
        }
    }

}
