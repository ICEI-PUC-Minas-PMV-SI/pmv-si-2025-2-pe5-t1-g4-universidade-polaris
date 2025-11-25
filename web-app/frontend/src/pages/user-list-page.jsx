import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.js';
import { auth_service } from '../services/auth-service.js';
import { Loading } from '../components/loading.jsx';
import { Alert } from '../components/alert.jsx';
import { formatError } from '../utils/helpers.js';
import './user-management.css';

const ROLE_TRANSLATIONS = {
  admin: 'Administrador',
  moderator: 'Moderador',
  teacher: 'Professor',
  student: 'Estudante',
};

const ROLE_COLORS = {
  admin: '#ff6b6b',
  moderator: '#ffc107',
  teacher: '#4ecdc4',
  student: '#95e1d3',
};

export const UserManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState(searchParams.get('role') || '');
  const [successMessage, setSuccessMessage] = useState('');

  const isAdminOrModerator = ['admin', 'moderator'].includes(user?.role);

  useEffect(() => {
    if (!isAdminOrModerator) {
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [currentPage, filterRole, isAdminOrModerator, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await auth_service.getAllUsers(currentPage, 10);

      if (response.success && response.data?.users) {
        let filteredUsers = response.data.users;

        if (filterRole) {
          filteredUsers = filteredUsers.filter((u) => u.role === filterRole);
        }

        setUsers(filteredUsers);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError(response.error || 'Erro ao buscar usuários');
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Tem certeza que deseja deletar ${userName}?`)) {
      try {
        const response = await auth_service.deleteUser(userId);
        if (response.success) {
          setSuccessMessage('Usuário deletado com sucesso');
          fetchUsers();
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(response.error || 'Erro ao deletar usuário');
        }
      } catch (err) {
        setError(formatError(err));
      }
    }
  };

  const handleEdit = (userId) => {
    navigate(`/users/${userId}`);
  };

  const getAvailableRoles = () => {
    const allRoles = ['admin', 'moderator', 'teacher', 'student'];
    if (user?.role === 'moderator') {
      return allRoles.filter((r) => r !== 'admin');
    }
    return allRoles;
  };

  if (loading) {
    return <Loading />;
  }

  const getRoleLabel = () => {
    if (!filterRole) return 'Todos os Usuários';
    const roleMap = { admin: 'Administradores', moderator: 'Moderadores', teacher: 'Professores', student: 'Estudantes' };
    return roleMap[filterRole] || 'Usuários';
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>{getRoleLabel()}</h1>
        <button className="button button-primary" onClick={() => navigate('/users/new')}>
          ➕ Novo Usuário
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="role-filter">Filtrar por Função:</label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Todos os Usuários</option>
            {getAvailableRoles().map((role) => (
              <option key={role} value={role}>
                {ROLE_TRANSLATIONS[role]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="role-badge" style={{ backgroundColor: ROLE_COLORS[u.role] }}>
                      {ROLE_TRANSLATIONS[u.role]}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="button button-secondary" onClick={() => handleEdit(u.id)}>
                        Editar
                      </button>
                      {user?.role === 'admin' && u.id !== user.id && (
                        <button className="button button-danger" onClick={() => handleDelete(u.id, u.name)}>
                          Deletar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="button button-secondary"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="button button-secondary"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};
