const Flag = require('../models/Flag');
const ProductFlag = require('../models/ProductFlag');

async function createFlag(storeId, payload) {
  const flag = await Flag.create({ ...payload, store_id: storeId });
  return flag.toObject();
}

async function listFlags(storeId, { page = 1, limit = 20, search = '' }) {
  const query = { store_id: storeId };
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Flag.find(query).sort({ priority: -1, created_at: -1 }).skip(skip).limit(Number(limit)).lean(),
    Flag.countDocuments(query)
  ]);

  return { items, total, page: Number(page), limit: Number(limit) };
}

async function getFlag(storeId, id) {
  return Flag.findOne({ store_id: storeId, _id: id }).lean();
}

async function updateFlag(storeId, id, payload) {
  return Flag.findOneAndUpdate(
    { store_id: storeId, _id: id },
    { $set: payload },
    { new: true }
  ).lean();
}

async function deleteFlag(storeId, id) {
  await ProductFlag.deleteMany({ store_id: storeId, flag_id: id });
  return Flag.findOneAndDelete({ store_id: storeId, _id: id }).lean();
}

module.exports = { createFlag, listFlags, getFlag, updateFlag, deleteFlag };
