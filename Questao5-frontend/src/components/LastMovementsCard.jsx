import MovementRow from './MovementRow';

export default function LastMovementsCard({ movimentos }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Últimos movimentos</h2>
      </div>
      {movimentos.length === 0 && (
        <p className="muted small">Nenhuma movimentação enviada ainda para esta conta.</p>
      )}
      {movimentos.length > 0 && (
        <ul className="movement-list">
          {movimentos.map((m) => (
            <MovementRow key={m.idMovimento} movimento={m} useApiFormat={false} />
          ))}
        </ul>
      )}
    </div>
  );
}
