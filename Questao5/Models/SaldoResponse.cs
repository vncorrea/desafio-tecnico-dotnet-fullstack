namespace Questao5.Models
{
    /// <summary>Resposta de sucesso da consulta de saldo.</summary>
    public class SaldoResponse
    {
        /// <summary>Número da conta corrente.</summary>
        /// <example>123</example>
        public int NumeroContaCorrente { get; set; }

        /// <summary>Nome do titular da conta corrente.</summary>
        /// <example>Katherine Sanchez</example>
        public string NomeTitular { get; set; } = string.Empty;

        /// <summary>Data e hora da resposta da consulta.</summary>
        public DateTime DataHoraResposta { get; set; }

        /// <summary>Valor do saldo atual (créditos - débitos).</summary>
        /// <example>1500.75</example>
        public decimal Saldo { get; set; }
    }
}
