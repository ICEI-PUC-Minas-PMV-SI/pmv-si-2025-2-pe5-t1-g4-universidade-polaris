import { SecurityLogger } from "../lib/index.js";
import { env } from "./env.js";

const allowedOrigins = [
  env.server.corsOrigin,
  'http://localhost:3000',                       
  'http://localhost:5173',
  'http://127.0.0.1:5173',                 
];

const cors_options = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      new SecurityLogger().logUnauthorizedAccess(null, 'CORS', 'Origin not allowed', { origin });
      callback(new Error('Acesso bloqueado pela política de CORS da Universidade Polaris.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  credentials: true, 
  
  maxAge: 86400 
}

export { cors_options };