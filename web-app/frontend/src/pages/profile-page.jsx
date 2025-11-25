import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.js';
import { auth_service } from '../services/auth-service.js';
import { Alert } from '../components/alert.jsx';
import './profile.css';

const ROLE_TRANSLATIONS = {
  admin: 'Administrador',
  moderator: 'Moderador',
  teacher: 'Professor',
  student: 'Estudante',
};

const ROLE_PERMISSIONS = {
  admin: [
    'Acesso total ao sistema',
    'Visualizar todos os registros de estudantes',
    'Criar, editar e deletar estudantes',
    'Gerenciar usuários do sistema',
    'Visualizar estatísticas',
  ],
  moderator: [
    'Visualizar todos os registros de estudantes',
    'Criar, editar e deletar estudantes',
    'Gerenciar professores',
    'Visualizar estatísticas',
  ],
  teacher: [
    'Visualizar registros de estudantes',
    'Criar e editar estudantes',
    'Filtrar por curso ou status',
  ],
  student: [
    'Visualizar seu próprio perfil',
    'Editar informações básicas do seu perfil',
  ],
};

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    navigate('/dashboard');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await auth_service.updateProfile(updateData);

      if (response.success) {
        setAlert({ type: 'success', message: 'Perfil atualizado com sucesso!' });
        setIsEditing(false);
        
        const updatedUser = response.data?.user;
        if (updatedUser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        setFormData({
          name: response.data?.user?.name || '',
          email: response.data?.user?.email || '',
          password: '',
          passwordConfirm: '',
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setAlert({ type: 'error', message: response.error || 'Erro ao atualizar perfil' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      passwordConfirm: '',
    });
    setErrors({});
  };

  const roleLabel = ROLE_TRANSLATIONS[user?.role] || user?.role;
  const permissions = ROLE_PERMISSIONS[user?.role] || [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Meu Perfil</h1>
          <button className="button button-secondary" onClick={handleBack}>
            ← Voltar para Dashboard
          </button>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="profile-content">
          {!isEditing ? (
            <>
              <div className="profile-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>Informações Pessoais</h2>
                  <button
                    className="button button-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </button>
                </div>
                
                <div className="profile-field">
                  <label className="profile-label">Nome Completo</label>
                  <div className="profile-value">{user?.name || 'N/A'}</div>
                </div>

                <div className="profile-field">
                  <label className="profile-label">Email</label>
                  <div className="profile-value">{user?.email || 'N/A'}</div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Função no Sistema</h2>
                
                <div className="profile-field">
                  <label className="profile-label">Função</label>
                  <div className="profile-value">
                    <span className="badge badge-yellow">{roleLabel}</span>
                  </div>
                </div>

                <div className="role-description">
                  <p>Como <strong>{roleLabel}</strong>, você possui as seguintes permissões:</p>
                  <ul>
                    {permissions.map((perm, idx) => (
                      <li key={idx}>{perm}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="profile-section">
                <h2>Informações da Conta</h2>
                
                <div className="profile-field">
                  <label className="profile-label">Status da Conta</label>
                  <div className="profile-value">
                    <span className="badge badge-green">Ativa</span>
                  </div>
                </div>

                <div className="profile-field">
                  <label className="profile-label">Data de Criação</label>
                  <div className="profile-value">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="profile-section">
              <h2>Editar Informações Pessoais</h2>

              <div className="form-group">
                <label htmlFor="name">Nome Completo</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'form-error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Digite o email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'form-error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Nova Senha (deixe em branco para manter a atual)</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? 'form-error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirmar Nova Senha</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className={errors.passwordConfirm ? 'form-error' : ''}
                />
                {errors.passwordConfirm && <span className="error-message">{errors.passwordConfirm}</span>}
              </div>

              <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="profile-footer">
            <button className="button button-primary" onClick={handleBack}>
              Voltar para Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
