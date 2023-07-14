import * as dotenv from 'dotenv';

dotenv.config();

async function run() {
  return new Promise<void>((resolve) => {
    console.log('test');
    resolve();

    process.exit(0);
  });
}

run();
