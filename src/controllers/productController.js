const { success } = require('../utils/response');
const productService = require('../services/productService');

async function addFlags(req, res) {
  const flagIds = await productService.addFlagsToProduct(
    req.user.store_id,
    req.validated.params.productId,
    req.validated.body.flagIds
  );
  return success(res, { flagIds });
}

async function replaceFlags(req, res) {
  const flagIds = await productService.replaceFlagsOnProduct(
    req.user.store_id,
    req.validated.params.productId,
    req.validated.body.flagIds
  );
  return success(res, { flagIds });
}

async function removeFlag(req, res) {
  await productService.removeFlagFromProduct(
    req.user.store_id,
    req.validated.params.productId,
    req.validated.params.flagId
  );
  return success(res, { deleted: true });
}

module.exports = { addFlags, replaceFlags, removeFlag };
