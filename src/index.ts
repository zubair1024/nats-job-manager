import process from 'node:process';

import configuration from './utils/configuration';
import logger from './utils/logger';
import cacheManager from './cacheManager';
import jobManager from './jobManager';

async function main() {
  logger.info(`App running in ${configuration.env} env!`);
  logger.info(`App has the following the following configuration ${JSON.stringify(configuration)}`);
  await cacheManager.init();
  console.log(`setting cache value`);
  await cacheManager.set('test', { test: 'test' });
  console.log(`getting cache value`);
  const test = await cacheManager.get<{ test: string }>('test');
  console.log(test);
  await jobManager.forkExclusiveConsumer('JOBS');
}

process.on('uncaughtException', (error: unknown) => {
  if (error instanceof Error) {
    logger.error(error);
  }
  process.exit(1);
});

process.on('unhandledRejection', (error: unknown) => {
  if (error instanceof Error) {
    logger.error(error);
  }
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM');
  process.exit(0);
});

main();
