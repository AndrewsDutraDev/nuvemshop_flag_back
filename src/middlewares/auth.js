const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');
const { getEnv } = require('../utils/env');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return error(res, 'Unauthorized', 401);

  try {
    const env = getEnv();
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return error(res, 'Invalid token', 401);
  }
}

module.exports = { authRequired };
