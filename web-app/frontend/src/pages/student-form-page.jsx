import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudent } from '../hooks/use-student.js';
import { student_service } from '../services/student-service.js';
import { Alert } from '../components/alert.jsx';
import { Loading } from '../components/loading.jsx';
import { formatError, isValidEmail } from '../utils/helpers.js';
import './student-form.css';

export const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const is_edit_mode = !!id;

  const [form_data, setFormData] = useState({
    name: '',
    email: '',
    registration_number: '',
    course: '',
    semester: '',
    gpa: '',
    phone: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [is_loading, setIsLoading] = useState(is_edit_mode);
  const { createStudent, updateStudent } = useStudent();

  useEffect(() => {
    if (is_edit_mode) {
      loadStudent();
    }
  }, [id]);

  const loadStudent = async () => {
    try {
      const response = await student_service.getStudentById(id);
      setFormData(response.data.student);
    } catch (err) {
      setAlert({ type: 'error', message: formatError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const new_errors = {};

    if (!form_data.name.trim()) {
      new_errors.name = 'Nome é obrigatório';
    } else if (form_data.name.trim().length < 2) {
      new_errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!form_data.email.trim()) {
      new_errors.email = 'Email é obrigatório';
    } else if (!isValidEmail(form_data.email)) {
      new_errors.email = 'Formato de email inválido';
    }

    if (!form_data.registration_number.trim()) {
      new_errors.registration_number = 'Número de matrícula é obrigatório';
    }

    if (!form_data.course.trim()) {
      new_errors.course = 'Curso é obrigatório';
    }

    if (!form_data.semester) {
      new_errors.semester = 'Período é obrigatório';
    } else if (form_data.semester < 1 || form_data.semester > 8) {
      new_errors.semester = 'Período deve estar entre 1 e 8';
    }

    if (form_data.gpa && (form_data.gpa < 0 || form_data.gpa > 10)) {
      new_errors.gpa = 'GPA deve estar entre 0 e 10';
    }

    return new_errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const new_errors = validateForm();

    if (Object.keys(new_errors).length > 0) {
      setErrors(new_errors);
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...form_data,
        gpa: form_data.gpa ? parseFloat(form_data.gpa) : null,
        phone: form_data.phone || null,
      };

      if (is_edit_mode) {
        await updateStudent(id, submitData);
        setAlert({ type: 'success', message: 'Estudante atualizado com sucesso' });
      } else {
        await createStudent(submitData);
        setAlert({ type: 'success', message: 'Estudante criado com sucesso' });
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setAlert({ type: 'error', message: formatError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  if (is_loading && is_edit_mode) return <Loading />;

  return (
    <div className="student-form-container">
      <div className="form-card">
        <h1>{is_edit_mode ? 'Editar Estudante' : 'Criar Novo Estudante'}</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={form_data.name}
                onChange={handleChange}
                placeholder="Nome do estudante"
                disabled={is_loading}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={form_data.email}
                onChange={handleChange}
                placeholder="estudante@universidade.com"
                disabled={is_loading}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Número de Matrícula</label>
              <input
                type="text"
                name="registration_number"
                className="form-input"
                value={form_data.registration_number}
                onChange={handleChange}
                placeholder="2024001"
                disabled={is_loading || is_edit_mode}
              />
              {errors.registration_number && (
                <span className="form-error">{errors.registration_number}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Curso</label>
              <input
                type="text"
                name="course"
                className="form-input"
                value={form_data.course}
                onChange={handleChange}
                placeholder="Ciência da Computação"
                disabled={is_loading}
              />
              {errors.course && <span className="form-error">{errors.course}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Período</label>
              <select
                name="semester"
                className="form-select"
                value={form_data.semester}
                onChange={handleChange}
                disabled={is_loading}
              >
                <option value="">Selecionar período</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Período {sem}
                  </option>
                ))}
              </select>
              {errors.semester && <span className="form-error">{errors.semester}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">GPA (Opcional)</label>
              <input
                type="number"
                name="gpa"
                className="form-input"
                value={form_data.gpa}
                onChange={handleChange}
                placeholder="8.5"
                min="0"
                max="10"
                step="0.1"
                disabled={is_loading}
              />
              {errors.gpa && <span className="form-error">{errors.gpa}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Telefone (Opcional)</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={form_data.phone}
                onChange={handleChange}
                placeholder="11 9 9999-9999"
                disabled={is_loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form_data.status}
                onChange={handleChange}
                disabled={is_loading}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="graduated">Formado</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="button button-success"
              disabled={is_loading}
            >
              {is_loading ? 'Salvando...' : is_edit_mode ? 'Atualizar Estudante' : 'Criar Estudante'}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={is_loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
