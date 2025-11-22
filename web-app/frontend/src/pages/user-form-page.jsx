import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth.js';
import { auth_service } from '../services/auth-service.js';
import { Loading } from '../components/loading.jsx';
import { Alert } from '../components/alert.jsx';
import { formatError } from '../utils/helpers.js';
import './user-form.css';

const ROLE_TRANSLATIONS = {
  admin: 'Administrador',
  moderator: 'Moderador',
  teacher: 'Professor',
  student: 'Estudante',
};

const ROLE_HIERARCHY = {
  admin: 0,
  moderator: 1,
  teacher: 2,
  student: 3,
};

export const UserFormPage = () => {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});

  const isAdminOrModerator = ['admin', 'moderator'].includes(currentUser?.role);
  const isTeacher = currentUser?.role === 'teacher';
  const canAccessForm = isAdminOrModerator || isTeacher;
  const isReadOnly = false;

  const canManageRole = (targetRole) => {
    if (!currentUser) return false;
    const userLevel = ROLE_HIERARCHY[currentUser.role];
    const targetLevel = ROLE_HIERARCHY[targetRole];
    return userLevel < targetLevel;
  };

  useEffect(() => {
    if (!canAccessForm) {
      navigate('/dashboard');
      return;
    }

    if (id) {
      fetchUser();
    }
  }, [id, canAccessForm, navigate]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await auth_service.getUserById(id);
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        
        if (!canManageRole(userData.role)) {
          setError('Você não tem permissão para editar esse usuário');
          setTimeout(() => navigate('/users'), 2000);
          return;
        }

        setTargetUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          passwordConfirm: '',
          role: userData.role || 'student',
        });
      } else {
        setError(response.error || 'Erro ao carregar usuário');
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
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

    if (!id) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'As senhas não coincidem';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    if (!canManageRole(formData.role)) {
      setError('Você não tem permissão para atribuir essa função');
      return;
    }

    try {
      setLoading(true);

      if (id) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await auth_service.updateUser(id, updateData);
        if (response.success) {
          setSuccess('Usuário atualizado com sucesso!');
          setTimeout(() => navigate('/users'), 2000);
        } else {
          setError(response.error || 'Erro ao atualizar usuário');
        }
      } else {
        const response = await auth_service.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        if (response.success) {
          setSuccess('Usuário criado com sucesso!');
          setTimeout(() => navigate('/users'), 2000);
        } else {
          setError(response.error || 'Erro ao criar usuário');
        }
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const getAvailableRoles = () => {
    if (isTeacher) {
      return ['student'];
    }
    const allRoles = ['admin', 'moderator', 'teacher', 'student'];
    const userLevel = ROLE_HIERARCHY[currentUser?.role];
    
    return allRoles.filter((role) => {
      const roleLevel = ROLE_HIERARCHY[role];
      return roleLevel > userLevel;
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="user-form-container">
      <div className="form-card">
        <h1>{id ? 'Editar Usuário' : 'Criar Novo Usuário'}</h1>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Senha {id && '(deixe em branco para manter a atual)'}</label>
                <input
                  id="password"
                  type="password"
                  placeholder={id ? 'Deixe em branco para manter a atual' : 'Digite uma senha'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={errors.password ? 'form-error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirmar Senha</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="Confirme a senha"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className={errors.passwordConfirm ? 'form-error' : ''}
                />
                {errors.passwordConfirm && <span className="error-message">{errors.passwordConfirm}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role">Função</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {getAvailableRoles().map((role) => (
                    <option key={role} value={role}>
                      {ROLE_TRANSLATIONS[role]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="button button-secondary" onClick={() => navigate('/users')}>
                Cancelar
              </button>
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? 'Salvando...' : id ? 'Atualizar Usuário' : 'Criar Usuário'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};
