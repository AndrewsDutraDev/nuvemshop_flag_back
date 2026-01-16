const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/webhooks/nuvemshop', asyncHandler(handleWebhook));

module.exports = router;
