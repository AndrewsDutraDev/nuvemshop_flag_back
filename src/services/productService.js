const ProductFlag = require('../models/ProductFlag');
const Flag = require('../models/Flag');

async function addFlagsToProduct(storeId, productId, flagIds) {
  const flags = await Flag.find({ store_id: storeId, _id: { $in: flagIds } }).select('_id').lean();
  const validIds = flags.map((f) => f._id.toString());

  const ops = validIds.map((flagId) => ({
    updateOne: {
      filter: { store_id: storeId, product_id: productId, flag_id: flagId },
      update: { $setOnInsert: { store_id: storeId, product_id: productId, flag_id: flagId } },
      upsert: true
    }
  }));

  if (ops.length) await ProductFlag.bulkWrite(ops);
  return validIds;
}

async function replaceFlagsOnProduct(storeId, productId, flagIds) {
  await ProductFlag.deleteMany({ store_id: storeId, product_id: productId });
  return addFlagsToProduct(storeId, productId, flagIds);
}

async function removeFlagFromProduct(storeId, productId, flagId) {
  await ProductFlag.deleteOne({ store_id: storeId, product_id: productId, flag_id: flagId });
}

module.exports = { addFlagsToProduct, replaceFlagsOnProduct, removeFlagFromProduct };
