/**
 * Uma linha de movimento. Aceita formato da API (tipoMovimento, dataMovimento) ou do estado local (tipo, data).
 */
export default function MovementRow({ movimento, useApiFormat = false }) {
  const tipo = useApiFormat ? movimento.tipoMovimento : movimento.tipo;
  const valor = Number(movimento.valor ?? 0);
  const dataExibicao = useApiFormat ? movimento.dataMovimento : new Date(movimento.data).toLocaleTimeString('pt-BR');
  const id = movimento.idMovimento ?? movimento.id;

  return (
    <li key={id} className="movement-row">
      <div className="movement-left">
        <span className={`chip ${useApiFormat ? (tipo === 'C' ? 'chip-credit' : 'chip-debit') : `chip-${tipo === 'C' ? 'credit' : 'debit'}`}`}>
          {tipo === 'C' ? 'Crédito' : 'Débito'}
        </span>
        <span className="movement-time">{dataExibicao}</span>
      </div>
      <div className="movement-right">
        <span className="movement-value">
          {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        <span className="movement-id">#{(id || '').slice(0, 8)}</span>
      </div>
    </li>
  );
}
