import http from 'http';
import app from './config/app';
import { connectDB } from './config/database';
import logger from './utils/logger';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`ROMS backend running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

