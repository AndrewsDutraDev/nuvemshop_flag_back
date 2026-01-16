const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { oauthStart, oauthCallback } = require('../controllers/oauthController');

const router = express.Router();

router.get('/oauth/start', asyncHandler(oauthStart));
router.get('/oauth/callback', asyncHandler(oauthCallback));

module.exports = router;
