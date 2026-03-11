export default function ConsultarSaldoForm({
  idContaSaldo,
  setIdContaSaldo,
  onSubmit,
  loading,
  saldoResult,
  saldoError,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Consultar saldo</h2>
        <span className="muted small">
          GET <code>/api/ContaCorrente/{'{idContaCorrente}'}/saldo</code>
        </span>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span>Id da Conta Corrente (GUID)</span>
          <input
            className="input"
            type="text"
            value={idContaSaldo}
            onChange={(e) => setIdContaSaldo(e.target.value)}
          />
        </label>
        <button type="submit" className="button secondary" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar saldo'}
        </button>
      </form>
      <div className="result">
        <h3 className="muted">Resposta</h3>
        {loading && <p className="muted">Consultando...</p>}
        {!loading && saldoResult && (
          <div className="saldo-detalhes">
            <p><strong>Número da conta:</strong> {saldoResult.numeroContaCorrente}</p>
            <p><strong>Titular:</strong> {saldoResult.nomeTitular}</p>
            <p><strong>Data/Hora resposta:</strong> {new Date(saldoResult.dataHoraResposta).toLocaleString('pt-BR')}</p>
            <p>
              <strong>Saldo atual:</strong>{' '}
              {saldoResult.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <details>
              <summary>JSON bruto</summary>
              <pre className="code-block">{JSON.stringify(saldoResult, null, 2)}</pre>
            </details>
          </div>
        )}
        {!loading && saldoError && (
          <div className="error">
            <strong>Erro</strong>
            <pre className="code-block">{JSON.stringify(saldoError, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
