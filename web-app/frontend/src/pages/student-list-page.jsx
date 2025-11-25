import { useState, useEffect } from 'react';
import { useStudent } from '../hooks/use-student.js';
import { Alert } from '../components/alert.jsx';
import { Loading } from '../components/loading.jsx';
import { getStatusBadge, formatError } from '../utils/helpers.js';
import './student-list.css';

export const StudentListPage = () => {
  const { students, isLoading, error, pagination, fetchStudents, deleteStudent } = useStudent();
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', course: '' });

  useEffect(() => {
    fetchStudents(currentPage, 10, filters);
  }, [currentPage, filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este estudante?')) {
      try {
        await deleteStudent(id);
        setAlert({ type: 'success', message: 'Estudante deletado com sucesso' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: formatError(err) });
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading && students.length === 0) return <Loading />;

  return (
    <div className="student-list-container">
      <h1>Gerenciamento de Estudantes</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {error && !students.length && (
        <Alert type="error" message={formatError(error)} />
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="graduated">Formado</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="course">Curso:</label>
          <input
            id="course"
            type="text"
            name="course"
            className="form-input"
            value={filters.course}
            onChange={handleFilterChange}
            placeholder="Filtrar por curso"
          />
        </div>
      </div>

      {students.length > 0 ? (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Matrícula</th>
                  <th>Curso</th>
                  <th>Período</th>
                  <th>GPA</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const statusBadge = getStatusBadge(student.status);
                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.registration_number}</td>
                      <td>{student.course}</td>
                      <td>{student.semester}</td>
                      <td>{student.gpa ? parseFloat(student.gpa).toFixed(2) : 'N/A'}</td>
                      <td>
                        <span className={`badge badge-${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <a href={`/students/${student.id}`} className="button button-primary">
                            Editar
                          </a>
                          <button
                            className="button button-danger"
                            onClick={() => handleDelete(student.id)}
                            disabled={isLoading}
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="button button-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Anterior
            </button>

            <span>
              Página {pagination.page} de {pagination.pages} (Total: {pagination.total})
            </span>

            <button
              className="button button-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.pages || isLoading}
            >
              Próxima
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Nenhum estudante encontrado</p>
          <a href="/students/new" className="button button-primary">
            Criar Primeiro Estudante
          </a>
        </div>
      )}
    </div>
  );
};
