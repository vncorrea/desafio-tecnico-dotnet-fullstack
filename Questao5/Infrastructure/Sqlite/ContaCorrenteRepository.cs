using Dapper;
using Microsoft.Data.Sqlite;
using Questao5.Domain.Entities;

namespace Questao5.Infrastructure.Sqlite
{
    public class ContaCorrenteRepository : IContaCorrenteRepository
    {
        private readonly DatabaseConfig _config;

        public ContaCorrenteRepository(DatabaseConfig config)
        {
            _config = config;
        }

        public async Task<ContaCorrente?> ObterPorIdAsync(string idContaCorrente, CancellationToken cancellationToken = default)
        {
            await using var connection = new SqliteConnection(_config.Name);
            var sql = "select idcontacorrente as IdContaCorrente, numero as Numero, nome as Nome, ativo as Ativo from contacorrente where idcontacorrente = @Id";
            return await connection.QueryFirstOrDefaultAsync<ContaCorrente>(new CommandDefinition(sql, new { Id = idContaCorrente }, cancellationToken: cancellationToken));
        }

        public async Task InserirMovimentoAsync(Movimento movimento, CancellationToken cancellationToken = default)
        {
            await using var connection = new SqliteConnection(_config.Name);
            var sql = @"insert into movimento (idmovimento, idcontacorrente, datamovimento, tipomovimento, valor)
                        values (@IdMovimento, @IdContaCorrente, @DataMovimento, @TipoMovimento, @Valor)";
            await connection.ExecuteAsync(new CommandDefinition(sql, movimento, cancellationToken: cancellationToken));
        }

        public async Task<decimal> ObterSaldoAsync(string idContaCorrente, CancellationToken cancellationToken = default)
        {
            await using var connection = new SqliteConnection(_config.Name);
            var sql = @"select 
                            coalesce(sum(case when tipomovimento = 'C' then valor else 0 end), 0) -
                            coalesce(sum(case when tipomovimento = 'D' then valor else 0 end), 0)
                        from movimento where idcontacorrente = @Id";
            var saldo = await connection.ExecuteScalarAsync<decimal>(new CommandDefinition(sql, new { Id = idContaCorrente }, cancellationToken: cancellationToken));
            return saldo;
        }
    }
}
