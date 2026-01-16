const { login } = require('../services/authService');
const { success, error } = require('../utils/response');
const Store = require('../models/Store');
const User = require('../models/User');

async function loginController(req, res) {
  const { email, password, store_id } = req.validated.body;
  const result = await login(email, password, store_id);
  if (!result) return error(res, 'Invalid credentials', 401);
  return success(res, result);
}

async function meController(req, res) {
  const user = await User.findOne({ _id: req.user.user_id, store_id: req.user.store_id }).lean();
  const store = await Store.findOne({ store_id: req.user.store_id }).lean();
  return success(res, {
    store_id: req.user.store_id,
    email: user?.email || null,
    role: user?.role || req.user.role,
    store: store ? { store_id: store.store_id, name: store.name } : null,
    plan: null
  });
}

module.exports = { loginController, meController };
