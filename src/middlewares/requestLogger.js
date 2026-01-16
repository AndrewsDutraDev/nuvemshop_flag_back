const { log } = require('../utils/logger');
const crypto = require('crypto');

function requestLogger(req, res, next) {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    log('info', 'request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      storeId: req.user?.store_id || null
    });
  });

  next();
}

module.exports = { requestLogger };
