const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: 'owner' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

UserSchema.index({ store_id: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
