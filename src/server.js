const { app } = require('./app');
const { connect } = require('./config/db');
const { getEnv } = require('./utils/env');
const { log } = require('./utils/logger');

async function start() {
  const env = getEnv();
  await connect(env.mongodbUri);

  app.listen(env.port, () => {
    log('info', `Server running on port ${env.port}`);
  });
}

start().catch((err) => {
  log('error', 'Failed to start server', { message: err.message, stack: err.stack });
  process.exit(1);
});
