namespace Questao5.Models
{
    /// <summary>Detalhe de um movimento lançado em conta corrente.</summary>
    public class MovimentoDetalheResponse
    {
        /// <summary>Identificador do movimento.</summary>
        public string IdMovimento { get; set; } = string.Empty;

        /// <summary>Data e hora do movimento (texto no formato dd/MM/yyyy HH:mm:ss).</summary>
        public string DataMovimento { get; set; } = string.Empty;

        /// <summary>Tipo do movimento: C = Crédito, D = Débito.</summary>
        public string TipoMovimento { get; set; } = string.Empty;

        /// <summary>Valor do movimento.</summary>
        public decimal Valor { get; set; }
    }
}

