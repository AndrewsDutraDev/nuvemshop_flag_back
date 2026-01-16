function log(level, message, meta = {}) {
  const payload = {
    level,
    message,
    time: new Date().toISOString(),
    ...meta
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

module.exports = { log };
