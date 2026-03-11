import { KNOWN_ACCOUNTS } from '../constants';

export default function AccountList({ contaSelecionadaId, saldoResult, onSelecionarConta }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Minhas contas</h2>
      </div>
      <ul className="account-list">
        {KNOWN_ACCOUNTS.map((conta) => (
          <li
            key={conta.id}
            className={`account-item ${conta.id === contaSelecionadaId ? 'account-item-active' : ''}`}
            onClick={() => onSelecionarConta(conta.id)}
          >
            <div className="account-main">
              <div className="account-avatar">
                {conta.nome.split(' ').map((p) => p[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="account-name">Conta {conta.numero} · {conta.nome}</p>
                <p className="account-sub">
                  {conta.status === 'Ativa' ? 'Conta conectada' : 'Conta inativa'}
                </p>
              </div>
            </div>
            <div className="account-right">
              <p className="account-balance">
                {conta.id === contaSelecionadaId && saldoResult != null
                  ? saldoResult.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : '--'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
