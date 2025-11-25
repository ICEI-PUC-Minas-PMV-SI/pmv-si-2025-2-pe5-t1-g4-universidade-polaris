import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.js';
import './dashboard.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdminOrModerator = ['admin', 'moderator'].includes(user?.role);
  const isTeacherOrAbove = ['admin', 'moderator', 'teacher'].includes(user?.role);

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Bem-vindo, {user?.name}!</h1>
        <p>Gerencie usuários e registros de forma eficiente</p>
      </div>

      <div className="dashboard-grid">
        {isAdminOrModerator && (
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h2>Gerenciar Usuários</h2>
            <p>Crie, edite ou delete usuários da plataforma</p>
            <button
              className="button button-primary"
              onClick={() => navigate('/users')}
            >
              Gerenciar Usuários
            </button>
          </div>
        )}

        {isTeacherOrAbove && (
          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h2>Estudantes</h2>
            <p>Visualize e gerencie todos os registros de estudantes</p>
            <button
              className="button button-primary"
              onClick={() => navigate('/users?role=student')}
            >
              Ver Estudantes
            </button>
          </div>
        )}

        <div className="dashboard-card">
          <div className="card-icon">👤</div>
          <h2>Perfil</h2>
          <p>Visualize suas informações de perfil</p>
          <button
            className="button button-primary"
            onClick={() => navigate('/profile')}
          >
            Ver Perfil
          </button>
        </div>
      </div>

      {(isAdminOrModerator || isTeacherOrAbove) && (
        <div className="info-section">
          <h2>Dicas Rápidas</h2>
          <ul>
            {isAdminOrModerator && (
              <>
                <li>Acesse "Gerenciar Usuários" para criar ou editar usuários</li>
                <li>Você pode atribuir diferentes funções (Admin, Moderador, Professor, Estudante)</li>
                <li>Filtre usuários por função para acesso rápido</li>
              </>
            )}
            {isTeacherOrAbove && (
              <>
                <li>Clique em "Estudantes" para gerenciar registros de estudantes</li>
                <li>Você pode editar ou deletar registros de estudantes</li>
                <li>Filtre estudantes por status ou curso para acesso rápido</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
