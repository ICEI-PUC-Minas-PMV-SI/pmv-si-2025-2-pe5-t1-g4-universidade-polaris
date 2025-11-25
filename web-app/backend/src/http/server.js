import express from 'express';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';
import { connectDatabase, cors_options, env } from '../config/index.js';
import { rate_limit_options } from '../config/rate-limit.js';
import { errorHandler, notFoundHandler } from '../middleware/error-handler.js';
import authRoutes from '../routes/auth-routes.js';
import userRoutes from '../routes/user-routes.js';

const app = express();

if (env.server.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(cors(cors_options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter(rate_limit_options));

await connectDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = env.server.port;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`); //TODO: alterar para URL de produção
  console.log(`✓ Environment: ${env.server.nodeEnv}`);
});

process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  process.exit(0);
});

