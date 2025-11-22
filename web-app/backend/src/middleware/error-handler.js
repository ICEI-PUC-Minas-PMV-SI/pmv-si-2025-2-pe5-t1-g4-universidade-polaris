/**
 * Error handling middleware
 * Centralizes error responses across the application
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  console.error(`[Error] ${status}: ${message}`);

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
};

/**
 * 404 Not Found middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Route not found',
    },
  });
};
