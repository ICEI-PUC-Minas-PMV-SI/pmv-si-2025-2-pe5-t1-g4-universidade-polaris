export const formatError = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  if (error?.error && typeof error.error === 'string') {
    return error.error;
  }
  if (error?.error?.details && Array.isArray(error.error.details)) {
    return error.error.details.map((d) => d.message).join(', ');
  }
  if (error?.details && Array.isArray(error.details)) {
    return error.details.map((d) => d.message).join(', ');
  }
  return error?.error?.message || error?.message || 'Um erro ocorreu';
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatStudent = (student) => {
  return {
    ...student,
    gpaDisplay: student.gpa ? student.gpa.toFixed(2) : 'N/A',
    statusBadge: getStatusBadge(student.status),
  };
};

export const getStatusBadge = (status) => {
  const badges = {
    active: { label: 'Ativo', color: 'green' },
    inactive: { label: 'Inativo', color: 'yellow' },
    graduated: { label: 'Formado', color: 'blue' },
  };
  return badges[status] || { label: status, color: 'gray' };
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
