import "../assets/styles/header.css";

type HeaderProps = {
  onAddAction?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onAddAction }) => {
  return (
    <header className="header" aria-label="header">
      <div className="header-content">
        <h1 className="header-title">Fumo Collector</h1>

        <div className="header-actions">
          <button
            className="header-button primary-button"
            aria-label="Add new item"
            onClick={onAddAction}
          >
            <span className="icon">+</span>
            <span className="button-text">Add</span>
          </button>

          <button
            className="header-button secondary-button"
            aria-label="Settings"
          >
            <span className="icon">🌞</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
