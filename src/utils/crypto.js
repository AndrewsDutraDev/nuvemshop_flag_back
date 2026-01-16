const crypto = require('crypto');

function getKey(key) {
  if (!key || key.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters');
  }
  return Buffer.from(key.slice(0, 32));
}

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(key), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decrypt(payload, key) {
  const data = Buffer.from(payload, 'base64');
  const iv = data.slice(0, 16);
  const tag = data.slice(16, 32);
  const encrypted = data.slice(32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(key), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
