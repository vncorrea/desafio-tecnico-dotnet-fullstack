export default function SaldoCard({ saldoResult, carregando }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Saldo geral</h2>
        <span className="muted small">Conta selecionada</span>
      </div>
      {carregando ? (
        <p className="muted small">Carregando...</p>
      ) : (
        <>
          <p className="big-balance">
            {saldoResult != null
              ? saldoResult.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'R$ 0,00'}
          </p>
          <p className="muted small">
            {saldoResult != null
              ? `Atualizado em ${new Date(saldoResult.dataHoraResposta).toLocaleString('pt-BR')}`
              : 'Selecione uma conta ativa para ver o saldo.'}
          </p>
        </>
      )}
    </div>
  );
}
