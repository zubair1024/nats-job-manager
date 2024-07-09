import process from 'node:process';

import configuration from './utils/configuration';
import logger from './utils/logger';
import cacheManager from './cacheManager';
import jobManager from './jobManager';
import c from 'config';

async function main() {
  logger.info(`App running in ${configuration.env} env!`);
  logger.info(`App has the following the following configuration ${JSON.stringify(configuration)}`);
  await cacheManager.init();
  console.log(`setting cache value`);
  await cacheManager.set('test', { test: 'test' });
  console.log(`getting cache value`);
  const test = await cacheManager.get<{ test: string }>('test');
  console.log(test);
  for (let i = 0; i < 1000; i++) {
    await jobManager.deleteJobStream(`JOBS_${i}`).catch((err) => {
      console.log(err);
    });
    await jobManager.forkExclusiveConsumer<{ test: string }>(`JOBS_${i}`, async function (msg) {
      console.log(msg);
    });
  }
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      console.log(`publishing to queue ${i}`);
      await jobManager.publishToQueue<{ test: string }>(`JOBS_${i}`, { test: 'test' });
    }
  }
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
