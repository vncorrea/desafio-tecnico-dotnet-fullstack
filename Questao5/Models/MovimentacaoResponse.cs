namespace Questao5.Models
{
    /// <summary>Resposta de sucesso da movimentação.</summary>
    public class MovimentacaoResponse
    {
        /// <summary>Identificador do movimento gerado.</summary>
        /// <example>7c9e6679-7425-40de-944b-e07fc1f90ae7</example>
        public string IdMovimento { get; set; } = string.Empty;
    }
}
