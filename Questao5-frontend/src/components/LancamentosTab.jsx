import MovementRow from './MovementRow';

export default function LancamentosTab({
  contaSelecionada,
  carregandoMovimentos,
  erroMovimentos,
  movimentosCarregados,
}) {
  return (
    <section className="row">
      <div className="card">
        <div className="card-header">
          <h2>Lançamentos da conta</h2>
          <span className="muted small">
            GET <code>/api/ContaCorrente/{'{idContaCorrente}'}/movimentos</code>
          </span>
        </div>
        <p className="muted small">
          Conta atual: {contaSelecionada.numero} · {contaSelecionada.nome}
        </p>

        {carregandoMovimentos && <p className="muted small">Carregando lançamentos...</p>}

        {!carregandoMovimentos && erroMovimentos && (
          <div className="error">
            <strong>Erro</strong>
            <pre className="code-block">{JSON.stringify(erroMovimentos, null, 2)}</pre>
          </div>
        )}

        {!carregandoMovimentos && !erroMovimentos && movimentosCarregados.length === 0 && (
          <p className="muted small">Nenhum lançamento encontrado para esta conta.</p>
        )}

        {!carregandoMovimentos && !erroMovimentos && movimentosCarregados.length > 0 && (
          <ul className="movement-list">
            {movimentosCarregados.map((m) => (
              <MovementRow key={m.idMovimento} movimento={m} useApiFormat />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
