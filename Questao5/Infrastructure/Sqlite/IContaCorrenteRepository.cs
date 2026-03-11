using Questao5.Domain.Entities;

namespace Questao5.Infrastructure.Sqlite
{
    public interface IContaCorrenteRepository
    {
        Task<ContaCorrente?> ObterPorIdAsync(string idContaCorrente, CancellationToken cancellationToken = default);
        Task InserirMovimentoAsync(Movimento movimento, CancellationToken cancellationToken = default);
        Task<decimal> ObterSaldoAsync(string idContaCorrente, CancellationToken cancellationToken = default);
        Task<IEnumerable<Movimento>> ObterMovimentosPorContaAsync(string idContaCorrente, CancellationToken cancellationToken = default);
    }
}
