export default function RelatoriosTab({ contaSelecionada, movimentosCarregados, totaisRelatorio }) {
  return (
    <section className="row">
      <div className="card">
        <div className="card-header">
          <h2>Relatórios</h2>
        </div>

        {movimentosCarregados.length === 0 && (
          <p className="muted small">
            Nenhum lançamento carregado ainda. Acesse a aba Lançamentos para buscar os dados da conta.
          </p>
        )}

        {movimentosCarregados.length > 0 && (
          <div className="saldo-detalhes">
            <p><strong>Conta:</strong> {contaSelecionada.numero} · {contaSelecionada.nome}</p>
            <p><strong>Quantidade de lançamentos:</strong> {totaisRelatorio.quantidade}</p>
            <p>
              <strong>Total de créditos:</strong>{' '}
              {totaisRelatorio.creditos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p>
              <strong>Total de débitos:</strong>{' '}
              {totaisRelatorio.debitos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p>
              <strong>Saldo calculado:</strong>{' '}
              {totaisRelatorio.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
