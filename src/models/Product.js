const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    tags: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    sale_price: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

ProductSchema.index({ store_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Product', ProductSchema);
