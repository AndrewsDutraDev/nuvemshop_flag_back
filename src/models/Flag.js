const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    threshold: { type: Number, default: null },
    value: { type: String, default: null }
  },
  { _id: false }
);

const FlagSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, enum: ['badge', 'ribbon', 'icon'], required: true },
    text: { type: String, default: '' },
    bgColor: { type: String, default: '#000000' },
    textColor: { type: String, default: '#FFFFFF' },
    position: {
      type: String,
      enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      default: 'top-left'
    },
    priority: { type: Number, default: 0 },
    conditions: { type: [ConditionSchema], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

FlagSchema.index({ store_id: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Flag', FlagSchema);
