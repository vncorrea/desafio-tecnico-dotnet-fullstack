import { useEffect, useMemo, useState } from 'react';

const DEFAULT_API_BASE = 'http://localhost:5000';

const KNOWN_ACCOUNTS = [
  {
    id: 'B6BAFC09-6967-ED11-A567-055DFA4A16C9',
    numero: 123,
    nome: 'Katherine Sanchez',
    status: 'Ativa',
  },
  {
    id: 'FA99D033-7067-ED11-96C6-7C5DFA4A16C9',
    numero: 456,
    nome: 'Eva Woodward',
    status: 'Ativa',
  },
  {
    id: '382D323D-7067-ED11-8866-7D5DFA4A16C9',
    numero: 789,
    nome: 'Tevin Mcconnell',
    status: 'Ativa',
  },
  {
    id: 'F475F943-7067-ED11-A06B-7E5DFA4A16C9',
    numero: 741,
    nome: 'Ameena Lynn',
    status: 'Inativa',
  },
];

function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [activeTab, setActiveTab] = useState('overview');

  // Movimentação
  const [idContaMov, setIdContaMov] = useState(KNOWN_ACCOUNTS[0].id);
  const [valor, setValor] = useState('100.00');
  const [tipo, setTipo] = useState('C');
  const [idRequisicao, setIdRequisicao] = useState('');
  const [movResult, setMovResult] = useState(null);
  const [movError, setMovError] = useState(null);
  const [movLoading, setMovLoading] = useState(false);

  // Saldo
  const [idContaSaldo, setIdContaSaldo] = useState(KNOWN_ACCOUNTS[0].id);
  const [saldoResult, setSaldoResult] = useState(null);
  const [saldoError, setSaldoError] = useState(null);
  const [saldoLoading, setSaldoLoading] = useState(false);

  const [ultimosMovimentos, setUltimosMovimentos] = useState([]);
  const [movimentosCarregados, setMovimentosCarregados] = useState([]);
  const [carregandoMovimentos, setCarregandoMovimentos] = useState(false);
  const [erroMovimentos, setErroMovimentos] = useState(null);

  const normalizedBase = apiBase.replace(/\/+$/, '');

  const contaSelecionada = useMemo(
    () => KNOWN_ACCOUNTS.find((c) => c.id === idContaSaldo) ?? KNOWN_ACCOUNTS[0],
    [idContaSaldo],
  );

  const ultimosMovimentosDaContaSelecionada = useMemo(
    () => ultimosMovimentos.filter((m) => m.contaId === contaSelecionada.id),
    [ultimosMovimentos, contaSelecionada.id],
  );

  function selecionarConta(contaId) {
    setIdContaMov(contaId);
    setIdContaSaldo(contaId);
  }

  // Carrega lançamentos da conta selecionada quando entra na aba "lancamentos"
  useEffect(() => {
    if (activeTab !== 'lancamentos') {
      return;
    }

    async function carregar() {
      setCarregandoMovimentos(true);
      setErroMovimentos(null);
      try {
        const resp = await fetch(
          `${normalizedBase}/api/ContaCorrente/${encodeURIComponent(idContaSaldo)}/movimentos`,
        );
        const data = await resp.json();
        if (!resp.ok) {
          setErroMovimentos(data);
          setMovimentosCarregados([]);
        } else {
          setMovimentosCarregados(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setErroMovimentos({ tipo: 'NETWORK_ERROR', mensagem: err.message });
        setMovimentosCarregados([]);
      } finally {
        setCarregandoMovimentos(false);
      }
    }

    carregar();
  }, [activeTab, idContaSaldo, normalizedBase]);

  const totaisRelatorio = useMemo(() => {
    let creditos = 0;
    let debitos = 0;
    movimentosCarregados.forEach((m) => {
      if (m.tipoMovimento === 'C') {
        creditos += Number(m.valor || 0);
      } else if (m.tipoMovimento === 'D') {
        debitos += Number(m.valor || 0);
      }
    });
    return {
      creditos,
      debitos,
      saldo: creditos - debitos,
      quantidade: movimentosCarregados.length,
    };
  }, [movimentosCarregados]);

  async function handleMovimentacao(e) {
    e.preventDefault();
    setMovLoading(true);
    setMovResult(null);
    setMovError(null);

    try {
      const body = {
        idRequisicao: idRequisicao || null,
        idContaCorrente: idContaMov,
        valor: Number(valor),
        tipoMovimento: tipo,
      };

      const response = await fetch(`${normalizedBase}/api/ContaCorrente/movimentacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMovError(data);
      } else {
        setMovResult(data);
        setUltimosMovimentos((prev) => [
          {
            idMovimento: data.idMovimento,
            tipo,
            valor: Number(valor),
            data: new Date().toISOString(),
            contaId: idContaMov,
          },
          ...prev,
        ].slice(0, 5));
      }
    } catch (err) {
      setMovError({ tipo: 'NETWORK_ERROR', mensagem: err.message });
    } finally {
      setMovLoading(false);
    }
  }

  async function handleConsultarSaldo(e) {
    e.preventDefault();
    setSaldoLoading(true);
    setSaldoResult(null);
    setSaldoError(null);

    try {
      const response = await fetch(
        `${normalizedBase}/api/ContaCorrente/${encodeURIComponent(idContaSaldo)}/saldo`,
      );
      const data = await response.json();

      if (!response.ok) {
        setSaldoError(data);
      } else {
        setSaldoResult(data);
      }
    } catch (err) {
      setSaldoError({ tipo: 'NETWORK_ERROR', mensagem: err.message });
    } finally {
      setSaldoLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">nb</div>
          <div className="brand-text">
            <span className="brand-title">NovaBank Organize</span>
            <span className="brand-subtitle">Dashboard de contas e movimentações</span>
          </div>
        </div>
        <nav className="topnav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'nav-item-active' : ''}`}
            type="button"
            onClick={() => setActiveTab('overview')}
          >
            Visão geral
          </button>
          <button
            className={`nav-item ${activeTab === 'lancamentos' ? 'nav-item-active' : ''}`}
            type="button"
            onClick={() => setActiveTab('lancamentos')}
          >
            Lançamentos
          </button>
          <button
            className={`nav-item ${activeTab === 'relatorios' ? 'nav-item-active' : ''}`}
            type="button"
            onClick={() => setActiveTab('relatorios')}
          >
            Relatórios
          </button>
        </nav>
        <div className="topbar-user">
          <div className="avatar">V</div>
          <div className="user-info">
            <span className="user-name">Vinícius</span>
            <span className="user-role">Sandbox</span>
          </div>
        </div>
      </header>

      <main className="content">
        {activeTab === 'overview' && (
        <section className="row row-summary">
          <div className="card highlight">
            <p className="card-label">Boa tarde, Vinícius 👋</p>
            <p className="card-title muted">Controle suas contas em um só lugar.</p>
            <div className="highlight-grid">
              <div>
                <p className="muted">Receita mensal (simulada)</p>
                <p className="positive">R$ 13.883,00</p>
              </div>
              <div>
                <p className="muted">Despesa mensal (simulada)</p>
                <p className="negative">R$ 12.802,36</p>
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
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="http://localhost:5000"
            />
            <p className="muted small">
              Aponte para a API da Questão 5 em execução (confira em <code>launchSettings.json</code>{' '}
              ou no Swagger).
            </p>
          </div>
        </section>
        )}

        {activeTab === 'overview' && (
        <section className="row row-main">
          <div className="column column-accounts">
            <div className="card">
              <div className="card-header">
                <h2>Saldo geral</h2>
                <span className="muted small">Conta selecionada</span>
              </div>
              <p className="big-balance">
                {saldoResult
                  ? saldoResult.saldo.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  : 'R$ 0,00'}
              </p>
              <p className="muted small">
                {saldoResult
                  ? `Atualizado em ${new Date(
                      saldoResult.dataHoraResposta,
                    ).toLocaleString('pt-BR')}`
                  : 'Consulte o saldo para atualizar.'}
              </p>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Minhas contas</h2>
              </div>
              <ul className="account-list">
                {KNOWN_ACCOUNTS.map((conta) => (
                  <li
                    key={conta.id}
                    className={`account-item ${
                      conta.id === idContaSaldo ? 'account-item-active' : ''
                    }`}
                    onClick={() => selecionarConta(conta.id)}
                  >
                    <div className="account-main">
                      <div className="account-avatar">
                        {conta.nome
                          .split(' ')
                          .map((p) => p[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="account-name">
                          Conta {conta.numero} · {conta.nome}
                        </p>
                        <p className="account-sub">
                          {conta.status === 'Ativa' ? 'Conta conectada' : 'Conta inativa'}
                        </p>
                      </div>
                    </div>
                    <div className="account-right">
                      <p className="account-balance">
                        {conta.id === saldoResult?.idContaCorrente
                          ? saldoResult.saldo.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          : '--'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Últimos movimentos</h2>
              </div>
              {ultimosMovimentosDaContaSelecionada.length === 0 && (
                <p className="muted small">
                  Nenhuma movimentação enviada ainda para esta conta.
                </p>
              )}
              {ultimosMovimentosDaContaSelecionada.length > 0 && (
                <ul className="movement-list">
                  {ultimosMovimentosDaContaSelecionada.map((m) => (
                    <li key={m.idMovimento} className="movement-row">
                      <div className="movement-left">
                        <span className={`chip chip-${m.tipo === 'C' ? 'credit' : 'debit'}`}>
                          {m.tipo === 'C' ? 'Crédito' : 'Débito'}
                        </span>
                        <span className="movement-time">
                          {new Date(m.data).toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                      <div className="movement-right">
                        <span className="movement-value">
                          {m.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                        <span className="movement-id">#{m.idMovimento.slice(0, 8)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="column column-actions">
            <div className="card">
              <div className="card-header">
                <h2>Movimentar conta corrente</h2>
                <span className="muted small">
                  POST <code>/api/ContaCorrente/movimentacao</code>
                </span>
              </div>
              <form className="form" onSubmit={handleMovimentacao}>
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
                    <select
                      className="input"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                    >
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

                <button type="submit" className="button primary" disabled={movLoading}>
                  {movLoading ? 'Enviando...' : 'Enviar movimentação'}
                </button>
              </form>

              <div className="result">
                <h3 className="muted">Resposta</h3>
                {movLoading && <p className="muted">Processando...</p>}
                {!movLoading && movResult && (
                  <pre className="code-block">{JSON.stringify(movResult, null, 2)}</pre>
                )}
                {!movLoading && movError && (
                  <div className="error">
                    <strong>Erro</strong>
                    <pre className="code-block">{JSON.stringify(movError, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Consultar saldo</h2>
                <span className="muted small">
                  GET{' '}
                  <code>
                    /api/ContaCorrente/
                    {'{'}
                    idContaCorrente
                    {'}'}
                    /saldo
                  </code>
                </span>
              </div>
              <form className="form" onSubmit={handleConsultarSaldo}>
                <label className="field">
                  <span>Id da Conta Corrente (GUID)</span>
                  <input
                    className="input"
                    type="text"
                    value={idContaSaldo}
                    onChange={(e) => setIdContaSaldo(e.target.value)}
                  />
                </label>

                <button type="submit" className="button secondary" disabled={saldoLoading}>
                  {saldoLoading ? 'Consultando...' : 'Consultar saldo'}
                </button>
              </form>

              <div className="result">
                <h3 className="muted">Resposta</h3>
                {saldoLoading && <p className="muted">Consultando...</p>}
                {!saldoLoading && saldoResult && (
                  <div className="saldo-detalhes">
                    <p>
                      <strong>Número da conta:</strong> {saldoResult.numeroContaCorrente}
                    </p>
                    <p>
                      <strong>Titular:</strong> {saldoResult.nomeTitular}
                    </p>
                    <p>
                      <strong>Data/Hora resposta:</strong>{' '}
                      {new Date(saldoResult.dataHoraResposta).toLocaleString('pt-BR')}
                    </p>
                    <p>
                      <strong>Saldo atual:</strong>{' '}
                      {saldoResult.saldo.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                    <details>
                      <summary>JSON bruto</summary>
                      <pre className="code-block">
                        {JSON.stringify(saldoResult, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
                {!saldoLoading && saldoError && (
                  <div className="error">
                    <strong>Erro</strong>
                    <pre className="code-block">{JSON.stringify(saldoError, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {activeTab === 'lancamentos' && (
          <section className="row">
            <div className="card">
              <div className="card-header">
                <h2>Lançamentos da conta</h2>
                <span className="muted small">
                  GET{' '}
                  <code>
                    /api/ContaCorrente/
                    {'{'}
                    idContaCorrente
                    {'}'}
                    /movimentos
                  </code>
                </span>
              </div>
              <p className="muted small">
                Conta atual: {contaSelecionada.numero} · {contaSelecionada.nome}
              </p>

              {carregandoMovimentos && <p className="muted small">Carregando lançamentos...</p>}

              {!carregandoMovimentos && erroMovimentos && (
                <div className="error">
                  <strong>Erro</strong>
                  <pre className="code-block">
                    {JSON.stringify(erroMovimentos, null, 2)}
                  </pre>
                </div>
              )}

              {!carregandoMovimentos && !erroMovimentos && movimentosCarregados.length === 0 && (
                <p className="muted small">Nenhum lançamento encontrado para esta conta.</p>
              )}

              {!carregandoMovimentos && !erroMovimentos && movimentosCarregados.length > 0 && (
                <ul className="movement-list">
                  {movimentosCarregados.map((m) => (
                    <li key={m.idMovimento} className="movement-row">
                      <div className="movement-left">
                        <span
                          className={`chip ${
                            m.tipoMovimento === 'C' ? 'chip-credit' : 'chip-debit'
                          }`}
                        >
                          {m.tipoMovimento === 'C' ? 'Crédito' : 'Débito'}
                        </span>
                        <span className="movement-time">
                          {m.dataMovimento}
                        </span>
                      </div>
                      <div className="movement-right">
                        <span className="movement-value">
                          {Number(m.valor || 0).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                        <span className="movement-id">
                          #{(m.idMovimento || '').slice(0, 8)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {activeTab === 'relatorios' && (
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
                  <p>
                    <strong>Conta:</strong> {contaSelecionada.numero} · {contaSelecionada.nome}
                  </p>
                  <p>
                    <strong>Quantidade de lançamentos:</strong> {totaisRelatorio.quantidade}
                  </p>
                  <p>
                    <strong>Total de créditos:</strong>{' '}
                    {totaisRelatorio.creditos.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                  <p>
                    <strong>Total de débitos:</strong>{' '}
                    {totaisRelatorio.debitos.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                  <p>
                    <strong>Saldo calculado:</strong>{' '}
                    {totaisRelatorio.saldo.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
