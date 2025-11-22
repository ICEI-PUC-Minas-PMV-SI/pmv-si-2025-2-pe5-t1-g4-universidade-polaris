import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.js';
import './header.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBrandClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          <h1>Universidade Polaris</h1>
        </div>

        {user && (
          <nav className="header-nav">
            <div className="user-info">
              <span>Bem-vindo, {user.name}</span>
            </div>
            <button className="button button-secondary" onClick={handleLogout}>
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
