import api_client from './api-client.js';

export const student_service = {
  createStudent: async (student_data) => {
    return await api_client.post('/students', student_data);
  },

  getAllStudents: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    return await api_client.get(`/students?${params.toString()}`);
  },

  getStudentsByCourse: async (course, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    return await api_client.get(`/students/course/${course}?${params.toString()}`);
  },

  getStudentsByStatus: async (status, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    return await api_client.get(`/students/status/${status}?${params.toString()}`);
  },

  getStudentById: async (id) => {
    return await api_client.get(`/students/${id}`);
  },

  updateStudent: async (id, updates) => {
    return await api_client.put(`/students/${id}`, updates);
  },

  deleteStudent: async (id) => {
    return await api_client.delete(`/students/${id}`);
  },

  getStudentStats: async () => {
    return await api_client.get('/students/stats');
  },
};
