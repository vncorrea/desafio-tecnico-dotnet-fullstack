namespace Questao5.Domain.Entities
{
    public class Movimento
    {
        public string IdMovimento { get; set; } = string.Empty;
        public string IdContaCorrente { get; set; } = string.Empty;
        public string DataMovimento { get; set; } = string.Empty;
        public string TipoMovimento { get; set; } = "C"; // C = Crédito, D = Débito
        public decimal Valor { get; set; }
    }
}
