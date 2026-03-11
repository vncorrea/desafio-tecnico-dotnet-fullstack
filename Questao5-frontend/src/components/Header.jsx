export default function Header({ activeTab, onTabChange }) {
  return (
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
          onClick={() => onTabChange('overview')}
        >
          Visão geral
        </button>
        <button
          className={`nav-item ${activeTab === 'lancamentos' ? 'nav-item-active' : ''}`}
          type="button"
          onClick={() => onTabChange('lancamentos')}
        >
          Lançamentos
        </button>
        <button
          className={`nav-item ${activeTab === 'relatorios' ? 'nav-item-active' : ''}`}
          type="button"
          onClick={() => onTabChange('relatorios')}
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
  );
}
