const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    access_token: { type: String, default: null }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

StoreSchema.index({ store_id: 1 }, { unique: true });

module.exports = mongoose.model('Store', StoreSchema);
