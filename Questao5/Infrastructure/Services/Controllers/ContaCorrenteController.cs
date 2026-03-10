using Microsoft.AspNetCore.Mvc;
using Questao5.Domain.Entities;
using Questao5.Infrastructure.Sqlite;
using Questao5.Models;

namespace Questao5.Infrastructure.Services.Controllers
{
    /// <summary>API de conta corrente: movimentação e consulta de saldo.</summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ContaCorrenteController : ControllerBase
    {
        private readonly IContaCorrenteRepository _repository;
        private readonly ILogger<ContaCorrenteController> _logger;

        public ContaCorrenteController(IContaCorrenteRepository repository, ILogger<ContaCorrenteController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Realiza movimentação (crédito ou débito) em uma conta corrente.
        /// </summary>
        /// <param name="request">Identificação da conta, valor, tipo (C/D) e opcionalmente id da requisição.</param>
        /// <returns>200 com o Id do movimento criado, ou 400 em caso de dados inválidos.</returns>
        [HttpPost("movimentacao")]
        [ProducesResponseType(typeof(MovimentacaoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Movimentacao([FromBody] MovimentacaoRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_REQUEST", Mensagem = "Corpo da requisição inválido." });
            }

            var idConta = request.IdContaCorrente?.Trim();
            if (string.IsNullOrEmpty(idConta))
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_ACCOUNT", Mensagem = "Identificação da conta corrente é obrigatória." });
            }

            var conta = await _repository.ObterPorIdAsync(idConta, cancellationToken);
            if (conta == null)
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_ACCOUNT", Mensagem = "Conta corrente não cadastrada." });
            }

            if (conta.Ativo != 1)
            {
                return BadRequest(new ErroResponse { Tipo = "INACTIVE_ACCOUNT", Mensagem = "Conta corrente inativa. Apenas contas ativas podem receber movimentação." });
            }

            if (!request.Valor.HasValue || request.Valor.Value <= 0)
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_VALUE", Mensagem = "Apenas valores positivos podem ser movimentados." });
            }

            var tipo = request.TipoMovimento?.Trim()?.ToUpperInvariant();
            if (tipo != "C" && tipo != "D")
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_TYPE", Mensagem = "Tipo de movimento inválido. Use C para crédito ou D para débito." });
            }

            var idMovimento = Guid.NewGuid().ToString();
            var movimento = new Movimento
            {
                IdMovimento = idMovimento,
                IdContaCorrente = idConta,
                DataMovimento = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                TipoMovimento = tipo,
                Valor = request.Valor!.Value
            };

            await _repository.InserirMovimentoAsync(movimento, cancellationToken);
            _logger.LogInformation("Movimento {Id} inserido para conta {Conta}, tipo {Tipo}, valor {Valor}.", idMovimento, idConta, tipo, movimento.Valor);

            return Ok(new MovimentacaoResponse { IdMovimento = idMovimento });
        }

        /// <summary>
        /// Consulta o saldo atual de uma conta corrente.
        /// </summary>
        /// <param name="idContaCorrente">Identificação (GUID) da conta corrente.</param>
        /// <returns>200 com número, nome, data/hora da resposta e saldo, ou 400 se conta inválida ou inativa.</returns>
        [HttpGet("{idContaCorrente}/saldo")]
        [ProducesResponseType(typeof(SaldoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErroResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Saldo([FromRoute] string idContaCorrente, CancellationToken cancellationToken)
        {
            var id = idContaCorrente?.Trim();
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_ACCOUNT", Mensagem = "Identificação da conta corrente é obrigatória." });
            }

            var conta = await _repository.ObterPorIdAsync(id, cancellationToken);
            if (conta == null)
            {
                return BadRequest(new ErroResponse { Tipo = "INVALID_ACCOUNT", Mensagem = "Conta corrente não cadastrada." });
            }

            if (conta.Ativo != 1)
            {
                return BadRequest(new ErroResponse { Tipo = "INACTIVE_ACCOUNT", Mensagem = "Conta corrente inativa. Apenas contas ativas podem consultar saldo." });
            }

            var saldo = await _repository.ObterSaldoAsync(id, cancellationToken);

            return Ok(new SaldoResponse
            {
                NumeroContaCorrente = conta.Numero,
                NomeTitular = conta.Nome,
                DataHoraResposta = DateTime.Now,
                Saldo = Math.Round(saldo, 2)
            });
        }
    }
}
