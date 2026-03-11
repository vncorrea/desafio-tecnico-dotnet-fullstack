import SaldoCard from './SaldoCard';
import AccountList from './AccountList';
import LastMovementsCard from './LastMovementsCard';
import MovimentacaoForm from './MovimentacaoForm';
import ConsultarSaldoForm from './ConsultarSaldoForm';

export default function OverviewContent({
  saldoResult,
  carregandoSaldoOverview,
  idContaSaldo,
  selecionarConta,
  ultimosMovimentosDaContaSelecionada,
  // Movimentação
  idContaMov,
  setIdContaMov,
  valor,
  setValor,
  tipo,
  setTipo,
  idRequisicao,
  setIdRequisicao,
  handleMovimentacao,
  movLoading,
  movResult,
  movError,
  // Consultar saldo
  setIdContaSaldo,
  handleConsultarSaldo,
  saldoLoading,
  saldoError,
}) {
  return (
    <section className="row row-main">
      <div className="column column-accounts">
        <SaldoCard saldoResult={saldoResult} carregando={carregandoSaldoOverview} />
        <AccountList
          contaSelecionadaId={idContaSaldo}
          saldoResult={saldoResult}
          onSelecionarConta={selecionarConta}
        />
        <LastMovementsCard movimentos={ultimosMovimentosDaContaSelecionada} />
      </div>

      <div className="column column-actions">
        <MovimentacaoForm
          idContaMov={idContaMov}
          setIdContaMov={setIdContaMov}
          valor={valor}
          setValor={setValor}
          tipo={tipo}
          setTipo={setTipo}
          idRequisicao={idRequisicao}
          setIdRequisicao={setIdRequisicao}
          onSubmit={handleMovimentacao}
          loading={movLoading}
          result={movResult}
          error={movError}
        />
        <ConsultarSaldoForm
          idContaSaldo={idContaSaldo}
          setIdContaSaldo={setIdContaSaldo}
          onSubmit={handleConsultarSaldo}
          loading={saldoLoading}
          saldoResult={saldoResult}
          saldoError={saldoError}
        />
      </div>
    </section>
  );
}
