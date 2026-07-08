import { app } from './app';
import { Environment, Database } from './config';
import { Logger } from './utils';

const server = app.listen(Environment.port, () => {
  Logger.info(`Server started on port ${Environment.port} in ${Environment.nodeEnv} mode`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  Logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    Logger.info('HTTP server closed');

    try {
      await Database.destroy();
      Logger.info('Database connection pool destroyed');
    } catch (error) {
      Logger.error('Error destroying database pool', error);
    }

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    Logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
