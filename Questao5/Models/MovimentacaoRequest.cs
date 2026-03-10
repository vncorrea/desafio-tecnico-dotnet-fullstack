using System.ComponentModel.DataAnnotations;

namespace Questao5.Models
{
    /// <summary>Requisição de movimentação (crédito ou débito) em conta corrente.</summary>
    public class MovimentacaoRequest
    {
        /// <summary>Identificação única da requisição (idempotência).</summary>
        /// <example>550e8400-e29b-41d4-a716-446655440000</example>
        public string? IdRequisicao { get; set; }

        /// <summary>Identificação (GUID) da conta corrente.</summary>
        /// <example>B6BAFC09-6967-ED11-A567-055DFA4A16C9</example>
        [Required]
        public string? IdContaCorrente { get; set; }

        /// <summary>Valor a ser movimentado (sempre positivo).</summary>
        /// <example>100.50</example>
        [Required]
        public decimal? Valor { get; set; }

        /// <summary>Tipo de movimento: C = Crédito, D = Débito.</summary>
        /// <example>C</example>
        [Required]
        public string? TipoMovimento { get; set; }
    }
}
