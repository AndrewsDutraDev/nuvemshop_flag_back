const mongoose = require('mongoose');

const ProductFlagSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    product_id: { type: String, required: true, index: true },
    flag_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flag', required: true },
    created_at: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

ProductFlagSchema.index({ store_id: 1, product_id: 1 });
ProductFlagSchema.index({ store_id: 1, flag_id: 1 });
ProductFlagSchema.index({ store_id: 1, product_id: 1, flag_id: 1 }, { unique: true });

module.exports = mongoose.model('ProductFlag', ProductFlagSchema);
