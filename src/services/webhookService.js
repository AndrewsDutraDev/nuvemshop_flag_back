const Product = require('../models/Product');
const ProductFlag = require('../models/ProductFlag');

function normalizeProduct(payload, storeId) {
  return {
    store_id: storeId,
    product_id: String(payload.id || payload.product_id),
    name: payload.name || payload.title || 'Unnamed',
    tags: payload.tags || [],
    price: Number(payload.price || 0),
    sale_price: payload.sale_price !== undefined ? Number(payload.sale_price) : null,
    stock: Number(payload.stock || 0),
    created_at: payload.created_at ? new Date(payload.created_at) : new Date(),
    updated_at: payload.updated_at ? new Date(payload.updated_at) : new Date()
  };
}

async function upsertProduct(payload, storeId) {
  const product = normalizeProduct(payload, storeId);
  await Product.updateOne(
    { store_id: storeId, product_id: product.product_id },
    { $set: product },
    { upsert: true }
  );
  return product;
}

async function deleteProduct(productId, storeId) {
  await Product.deleteOne({ store_id: storeId, product_id: productId });
  await ProductFlag.deleteMany({ store_id: storeId, product_id: productId });
}

module.exports = { upsertProduct, deleteProduct };
