const { success, error } = require('../utils/response');
const flagService = require('../services/flagService');

async function createFlag(req, res) {
  const flag = await flagService.createFlag(req.user.store_id, req.validated.body);
  return success(res, flag, 201);
}

async function listFlags(req, res) {
  const data = await flagService.listFlags(req.user.store_id, req.validated.query);
  return success(res, data);
}

async function getFlag(req, res) {
  const flag = await flagService.getFlag(req.user.store_id, req.validated.params.id);
  if (!flag) return error(res, 'Flag not found', 404);
  return success(res, flag);
}

async function updateFlag(req, res) {
  const flag = await flagService.updateFlag(
    req.user.store_id,
    req.validated.params.id,
    req.validated.body
  );
  if (!flag) return error(res, 'Flag not found', 404);
  return success(res, flag);
}

async function deleteFlag(req, res) {
  const flag = await flagService.deleteFlag(req.user.store_id, req.validated.params.id);
  if (!flag) return error(res, 'Flag not found', 404);
  return success(res, { deleted: true });
}

module.exports = { createFlag, listFlags, getFlag, updateFlag, deleteFlag };
