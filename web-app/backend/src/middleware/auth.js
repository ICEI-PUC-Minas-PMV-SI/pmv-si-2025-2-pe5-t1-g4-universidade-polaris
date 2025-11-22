import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const auth_header = req.headers.authorization;

    if (!auth_header || !auth_header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = auth_header.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (allowed_roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowed_roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden for your role' });
    }

    next();
  };
};
