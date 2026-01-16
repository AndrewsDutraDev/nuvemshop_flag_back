const crypto = require('crypto');
const { success, error } = require('../utils/response');
const { getEnv } = require('../utils/env');
const webhookService = require('../services/webhookService');
const Store = require('../models/Store');

function validateSignature(req) {
  const env = getEnv();
  const signature = req.headers['x-nuvemshop-hmac-sha256'];
  if (!signature) return false;
  const computed = crypto
    .createHmac('sha256', env.webhookSecret)
    .update(req.rawBody || '')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  } catch (err) {
    return false;
  }
}

async function handleWebhook(req, res) {
  if (!validateSignature(req)) {
    return error(res, 'Invalid signature', 401);
  }

  const event = req.headers['x-nuvemshop-event'] || req.body?.event;
  const storeId = String(req.headers['x-nuvemshop-store-id'] || req.body?.store_id || '');
  if (!storeId) return error(res, 'Missing store_id', 400);

  const store = await Store.findOne({ store_id: storeId }).lean();
  if (!store) {
    await Store.create({ store_id: storeId, name: `Store ${storeId}` });
  }

  if (event === 'product/created' || event === 'product/updated') {
    await webhookService.upsertProduct(req.body, storeId);
  } else if (event === 'product/deleted') {
    const productId = String(req.body?.id || req.body?.product_id);
    if (productId) {
      await webhookService.deleteProduct(productId, storeId);
    }
  }

  return success(res, { received: true });
}

module.exports = { handleWebhook };
