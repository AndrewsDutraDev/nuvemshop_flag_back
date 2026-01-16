const { success, error } = require('../utils/response');
const { getFlagsForProducts } = require('../services/publicService');
const { InMemoryCache } = require('../utils/cache');
const { getEnv } = require('../utils/env');

const cache = new InMemoryCache();

async function getPublicFlags(req, res) {
  const env = getEnv();
  const { store_id } = req.params;
  const { ids } = req.query;

  if (!ids || typeof ids !== 'string') {
    return error(res, 'ids query param is required', 400);
  }
  if (ids.length > env.publicIdsMaxLength) {
    return error(res, 'ids query param too long', 400);
  }

  const productIds = ids.split(',').map((id) => id.trim()).filter(Boolean);
  if (!productIds.length) {
    return error(res, 'ids query param is required', 400);
  }
  if (productIds.length > env.publicIdsLimit) {
    return error(res, 'ids limit exceeded', 400);
  }

  const cacheKey = `${store_id}:${productIds.sort().join(',')}`;
  const cached = cache.get(cacheKey);
  if (cached) return success(res, cached);

  const data = await getFlagsForProducts(store_id, productIds);
  cache.set(cacheKey, data, env.cacheTtlSeconds * 1000);
  return success(res, data);
}

module.exports = { getPublicFlags };
