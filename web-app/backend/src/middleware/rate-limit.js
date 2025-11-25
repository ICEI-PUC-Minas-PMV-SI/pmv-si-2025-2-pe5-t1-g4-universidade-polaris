import { SecurityLogger, ConsoleLogger } from '../lib/index.js';

const securityLogger = new SecurityLogger(new ConsoleLogger());
export const handleRateLimitExceeded = (req, res) => {
  const endpoint = req.originalUrl || req.path;
  const ip = req.ip || req.connection.remoteAddress;
  const user_email = req.body?.email || 'unknown';

  if (endpoint.includes('/login')) {
    securityLogger.logger.warn('RATE_LIMIT_EXCEEDED_LOGIN', {
      ip,
      email: user_email,
      timestamp: new Date().toISOString(),
      message: 'Multiple failed login attempts detected - possible brute force attack',
    });
  } else {
    securityLogger.logger.warn('RATE_LIMIT_EXCEEDED', {
      ip,
      endpoint,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(429).json({
    success: false,
    error: 'Muitas tentativas de login, por favor tente novamente mais tarde.',
    retryAfter: req.rateLimit?.resetTime || 'in 15 minutes',
  });
};

