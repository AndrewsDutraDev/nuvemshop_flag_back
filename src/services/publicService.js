const Flag = require('../models/Flag');
const Product = require('../models/Product');
const ProductFlag = require('../models/ProductFlag');

function evaluateConditions(product, conditions = []) {
  if (!conditions || !conditions.length) return true;

  return conditions.every((condition) => {
    switch (condition.type) {
      case 'sale_price_exists':
        return product.sale_price !== null && product.sale_price !== undefined;
      case 'stock_below':
        return typeof condition.threshold === 'number'
          ? product.stock < condition.threshold
          : false;
      case 'created_within_days': {
        const threshold = Number(condition.threshold || 0);
        if (!threshold) return false;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - threshold);
        return new Date(product.created_at) >= cutoff;
      }
      case 'tag_contains':
        if (!condition.value) return false;
        return (product.tags || []).some(
          (tag) => String(tag).toLowerCase() === String(condition.value).toLowerCase()
        );
      default:
        return false;
    }
  });
}

function sanitizeFlag(flag) {
  return {
    id: flag._id.toString(),
    name: flag.name,
    slug: flag.slug,
    type: flag.type,
    text: flag.text,
    bgColor: flag.bgColor,
    textColor: flag.textColor,
    position: flag.position,
    priority: flag.priority
  };
}

async function getFlagsForProducts(storeId, productIds) {
  const products = await Product.find({ store_id: storeId, product_id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((p) => [p.product_id, p]));

  const relations = await ProductFlag.find({
    store_id: storeId,
    product_id: { $in: productIds }
  }).lean();

  const relationsByProduct = new Map();
  for (const rel of relations) {
    if (!relationsByProduct.has(rel.product_id)) {
      relationsByProduct.set(rel.product_id, []);
    }
    relationsByProduct.get(rel.product_id).push(rel);
  }

  const flagIds = Array.from(new Set(relations.map((rel) => rel.flag_id.toString())));
  const flags = await Flag.find({ store_id: storeId, _id: { $in: flagIds }, isActive: true })
    .lean();

  const flagsMap = new Map(flags.map((f) => [f._id.toString(), f]));
  const grouped = {};

  for (const productId of productIds) {
    const product = productMap.get(productId);
    const productRelations = relationsByProduct.get(productId) || [];
    const filteredFlags = productRelations
      .map((rel) => flagsMap.get(rel.flag_id.toString()))
      .filter(Boolean)
      .filter((flag) => product && evaluateConditions(product, flag.conditions));

    grouped[productId] = filteredFlags
      .map(sanitizeFlag)
      .sort((a, b) => b.priority - a.priority);
  }

  return grouped;
}

module.exports = { getFlagsForProducts };
