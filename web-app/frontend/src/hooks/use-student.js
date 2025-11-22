import { useState, useCallback } from 'react';
import { student_service } from '../services/student-service.js';

export const useStudent = () => {
  const [students, setStudents] = useState([]);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchStudents = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await student_service.getAllStudents(page, limit);
      setStudents(response.data.students);
      setPagination(response.pagination);
      return response;
    } catch (err) {
      const errorMsg = err.error?.message || err.message || 'Failed to fetch students';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (student_data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await student_service.createStudent(student_data);
      setStudents((prev) => [response.data.student, ...prev]);
      return response;
    } catch (err) {
      const errorMsg = err.error?.message || err.message || 'Failed to create student';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await student_service.updateStudent(id, updates);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? response.data.student : s))
      );
      return response;
    } catch (err) {
      const errorMsg = err.error?.message || err.message || 'Failed to update student';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await student_service.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      const errorMsg = err.error?.message || err.message || 'Failed to delete student';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    students,
    is_loading,
    error,
    pagination,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
