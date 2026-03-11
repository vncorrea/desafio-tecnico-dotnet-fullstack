export default function OverviewSummary({
  receita,
  despesa,
  carregandoResumo,
  apiBase,
  onApiBaseChange,
}) {
  return (
    <section className="row row-summary">
      <div className="card highlight">
        <p className="card-label">Boa tarde, Vinícius 👋</p>
        <p className="card-title muted">Controle suas contas em um só lugar.</p>
        <div className="highlight-grid">
          <div>
            <p className="muted">Receita mensal</p>
            {carregandoResumo ? (
              <p className="muted small">Carregando...</p>
            ) : (
              <p className="positive">
                {receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            )}
          </div>
          <div>
            <p className="muted">Despesa mensal</p>
            {carregandoResumo ? (
              <p className="muted small">Carregando...</p>
            ) : (
              <p className="negative">
                {despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card highlight">
        <p className="card-label">Conexão com a API</p>
        <p className="card-title small">Base URL</p>
        <input
          type="text"
          className="input"
          value={apiBase}
          onChange={(e) => onApiBaseChange(e.target.value)}
          placeholder="http://localhost:5000"
        />
        <p className="muted small">
          Aponte para a API da Questão 5 em execução (confira em <code>launchSettings.json</code> ou no Swagger).
        </p>
      </div>
    </section>
  );
}
