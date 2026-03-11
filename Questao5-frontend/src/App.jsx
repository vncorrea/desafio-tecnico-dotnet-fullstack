import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_API_BASE, KNOWN_ACCOUNTS } from './constants';
import {
  Header,
  OverviewSummary,
  OverviewContent,
  LancamentosTab,
  RelatoriosTab,
} from './components';

function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [activeTab, setActiveTab] = useState('overview');

  const [idContaMov, setIdContaMov] = useState(KNOWN_ACCOUNTS[0].id);
  const [valor, setValor] = useState('100.00');
  const [tipo, setTipo] = useState('C');
  const [idRequisicao, setIdRequisicao] = useState('');
  const [movResult, setMovResult] = useState(null);
  const [movError, setMovError] = useState(null);
  const [movLoading, setMovLoading] = useState(false);

  const [idContaSaldo, setIdContaSaldo] = useState(KNOWN_ACCOUNTS[0].id);
  const [saldoResult, setSaldoResult] = useState(null);
  const [saldoError, setSaldoError] = useState(null);
  const [saldoLoading, setSaldoLoading] = useState(false);

  const [ultimosMovimentos, setUltimosMovimentos] = useState([]);
  const [movimentosCarregados, setMovimentosCarregados] = useState([]);
  const [carregandoMovimentos, setCarregandoMovimentos] = useState(false);
  const [erroMovimentos, setErroMovimentos] = useState(null);

  const [movimentosOverview, setMovimentosOverview] = useState([]);
  const [carregandoMovimentosOverview, setCarregandoMovimentosOverview] = useState(false);
  const [carregandoSaldoOverview, setCarregandoSaldoOverview] = useState(false);

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

  useEffect(() => {
    if (activeTab !== 'overview') return;
    const id = idContaSaldo;
    setCarregandoSaldoOverview(true);
    setCarregandoMovimentosOverview(true);

    (async () => {
      try {
        const [saldoResp, movResp] = await Promise.all([
          fetch(`${normalizedBase}/api/ContaCorrente/${encodeURIComponent(id)}/saldo`),
          fetch(`${normalizedBase}/api/ContaCorrente/${encodeURIComponent(id)}/movimentos`),
        ]);
        const saldoData = await saldoResp.json();
        const movData = await movResp.json();

        if (saldoResp.ok) setSaldoResult(saldoData);
        else setSaldoResult(null);

        if (movResp.ok && Array.isArray(movData)) setMovimentosOverview(movData);
        else setMovimentosOverview([]);
      } catch {
        setSaldoResult(null);
        setMovimentosOverview([]);
      } finally {
        setCarregandoSaldoOverview(false);
        setCarregandoMovimentosOverview(false);
      }
    })();
  }, [activeTab, idContaSaldo, normalizedBase]);

  const resumoMensal = useMemo(() => {
    const now = new Date();
    const mesAtual = now.getMonth() + 1;
    const anoAtual = now.getFullYear();
    let credito = 0;
    let debito = 0;
    movimentosOverview.forEach((m) => {
      const dataStr = m.dataMovimento || '';
      const [datePart] = dataStr.split(' ');
      const parts = datePart ? datePart.split('/') : [];
      if (parts.length >= 3) {
        const mes = parseInt(parts[1], 10);
        const ano = parseInt(parts[2], 10);
        if (mes === mesAtual && ano === anoAtual) {
          const v = Number(m.valor) || 0;
          if (m.tipoMovimento === 'C') credito += v;
          else if (m.tipoMovimento === 'D') debito += v;
        }
      }
    });
    return { receita: credito, despesa: debito };
  }, [movimentosOverview]);

  useEffect(() => {
    if (activeTab !== 'lancamentos') return;
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
      if (m.tipoMovimento === 'C') creditos += Number(m.valor || 0);
      else if (m.tipoMovimento === 'D') debitos += Number(m.valor || 0);
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
          { idMovimento: data.idMovimento, tipo, valor: Number(valor), data: new Date().toISOString(), contaId: idContaMov },
          ...prev,
        ].slice(0, 5));
        if (idContaMov === idContaSaldo && activeTab === 'overview') {
          try {
            const [saldoResp, movResp] = await Promise.all([
              fetch(`${normalizedBase}/api/ContaCorrente/${encodeURIComponent(idContaSaldo)}/saldo`),
              fetch(`${normalizedBase}/api/ContaCorrente/${encodeURIComponent(idContaSaldo)}/movimentos`),
            ]);
            if (saldoResp.ok) {
              const saldoData = await saldoResp.json();
              setSaldoResult(saldoData);
            }
            if (movResp.ok) {
              const movData = await movResp.json();
              setMovimentosOverview(Array.isArray(movData) ? movData : []);
            }
          } catch {
            // ignora
          }
        }
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
      if (!response.ok) setSaldoError(data);
      else setSaldoResult(data);
    } catch (err) {
      setSaldoError({ tipo: 'NETWORK_ERROR', mensagem: err.message });
    } finally {
      setSaldoLoading(false);
    }
  }

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="content">
        {activeTab === 'overview' && (
          <>
            <OverviewSummary
              receita={resumoMensal.receita}
              despesa={resumoMensal.despesa}
              carregandoResumo={carregandoMovimentosOverview}
              apiBase={apiBase}
              onApiBaseChange={setApiBase}
            />
            <OverviewContent
              saldoResult={saldoResult}
              carregandoSaldoOverview={carregandoSaldoOverview}
              idContaSaldo={idContaSaldo}
              selecionarConta={selecionarConta}
              ultimosMovimentosDaContaSelecionada={ultimosMovimentosDaContaSelecionada}
              idContaMov={idContaMov}
              setIdContaMov={setIdContaMov}
              valor={valor}
              setValor={setValor}
              tipo={tipo}
              setTipo={setTipo}
              idRequisicao={idRequisicao}
              setIdRequisicao={setIdRequisicao}
              handleMovimentacao={handleMovimentacao}
              movLoading={movLoading}
              movResult={movResult}
              movError={movError}
              setIdContaSaldo={setIdContaSaldo}
              handleConsultarSaldo={handleConsultarSaldo}
              saldoLoading={saldoLoading}
              saldoError={saldoError}
            />
          </>
        )}

        {activeTab === 'lancamentos' && (
          <LancamentosTab
            contaSelecionada={contaSelecionada}
            carregandoMovimentos={carregandoMovimentos}
            erroMovimentos={erroMovimentos}
            movimentosCarregados={movimentosCarregados}
          />
        )}

        {activeTab === 'relatorios' && (
          <RelatoriosTab
            contaSelecionada={contaSelecionada}
            movimentosCarregados={movimentosCarregados}
            totaisRelatorio={totaisRelatorio}
          />
        )}
      </main>
    </div>
  );
}

export default App;
