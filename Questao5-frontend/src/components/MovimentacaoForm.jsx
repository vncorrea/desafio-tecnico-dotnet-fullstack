export default function MovimentacaoForm({
  idContaMov,
  setIdContaMov,
  valor,
  setValor,
  tipo,
  setTipo,
  idRequisicao,
  setIdRequisicao,
  onSubmit,
  loading,
  result,
  error,
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Movimentar conta corrente</h2>
        <span className="muted small">POST <code>/api/ContaCorrente/movimentacao</code></span>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span>Id da Conta Corrente (GUID)</span>
          <input
            className="input"
            type="text"
            value={idContaMov}
            onChange={(e) => setIdContaMov(e.target.value)}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Valor</span>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Tipo</span>
            <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="C">Crédito (C)</option>
              <option value="D">Débito (D)</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>Id da Requisição (opcional)</span>
          <input
            className="input"
            type="text"
            value={idRequisicao}
            onChange={(e) => setIdRequisicao(e.target.value)}
          />
        </label>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar movimentação'}
        </button>
      </form>
      <div className="result">
        <h3 className="muted">Resposta</h3>
        {loading && <p className="muted">Processando...</p>}
        {!loading && result && (
          <pre className="code-block">{JSON.stringify(result, null, 2)}</pre>
        )}
        {!loading && error && (
          <div className="error">
            <strong>Erro</strong>
            <pre className="code-block">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
