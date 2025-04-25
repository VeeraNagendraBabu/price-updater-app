namespace backend.Models
{
    public class Item
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime UpdatedAt { get; set; }
        public PriceDirection PriceChange { get; set; }
    }

    public enum PriceDirection
    {
        Up,
        Down,
        None
    }
}