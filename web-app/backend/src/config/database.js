import { Sequelize } from 'sequelize';
import { config } from './index.js';

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
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
