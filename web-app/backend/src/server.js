import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${config.server.nodeEnv}`);
});

process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  process.exit(0);
});

