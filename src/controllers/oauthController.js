const { success } = require('../utils/response');
const { getOAuthStartUrl, handleOAuthCallback } = require('../services/oauthService');

async function oauthStart(req, res) {
  const { store_id } = req.query;
  const url = getOAuthStartUrl(store_id);
  return success(res, { url });
}

async function oauthCallback(req, res) {
  // TODO: validate code + exchange for access_token using Nuvemshop OAuth.
  const { store_id, access_token } = req.query;
  if (store_id && access_token) {
    await handleOAuthCallback({ store_id, access_token });
  }
  return success(res, { connected: true });
}

module.exports = { oauthStart, oauthCallback };
