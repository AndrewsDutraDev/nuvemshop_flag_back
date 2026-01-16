const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/public/:store_id/products/flags', asyncHandler(publicController.getPublicFlags));

module.exports = router;
