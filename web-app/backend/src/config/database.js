import { Sequelize } from 'sequelize';
import { env } from './index.js';
import fs from 'fs';

const cert_path = '/home/ubuntu/applications/pmv-si-2025-2-pe5-t1-g4-universidade-polaris/web-app/backend/global-bundle.pem';

const sequelize = new Sequelize(
env.database.database,
  env.database.username,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,
    dialect: env.database.dialect,
    logging: env.database.logging,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(cert_path)
      }
    }
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✓ Database disconnected successfully');
  } catch (error) {
    console.error('✗ Database disconnection failed:', error.message);
  }
};

export default sequelize;
