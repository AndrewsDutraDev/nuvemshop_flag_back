const { log } = require('../utils/logger');
const { error } = require('../utils/response');

function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return error(res, `Duplicate value for ${fields.join(', ')}`, 409, err.keyValue);
  }
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  log('error', 'handler_error', {
    requestId: req.requestId,
    status,
    message,
    stack: err.stack
  });
  return error(res, message, status, err.details);
}

module.exports = { errorHandler };
