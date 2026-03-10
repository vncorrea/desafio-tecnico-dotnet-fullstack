namespace Questao5.Models
{
    /// <summary>Resposta de erro da API (HTTP 400).</summary>
    public class ErroResponse
    {
        /// <summary>Tipo do erro: INVALID_ACCOUNT, INACTIVE_ACCOUNT, INVALID_VALUE, INVALID_TYPE.</summary>
        public string Tipo { get; set; } = string.Empty;

        /// <summary>Mensagem descritiva do erro.</summary>
        public string Mensagem { get; set; } = string.Empty;
    }
}
