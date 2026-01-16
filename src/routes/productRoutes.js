const express = require('express');
const { z } = require('zod');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../utils/asyncHandler');
const { authRequired } = require('../middlewares/auth');
const productController = require('../controllers/productController');

const router = express.Router();

const bodySchema = z.object({
  flagIds: z.array(z.string()).min(1)
});

const paramsSchema = z.object({
  productId: z.string()
});

const deleteParamsSchema = z.object({
  productId: z.string(),
  flagId: z.string()
});

router.use(authRequired);

router.post(
  '/products/:productId/flags',
  validate(z.object({ body: bodySchema, params: paramsSchema })),
  asyncHandler(productController.addFlags)
);
router.put(
  '/products/:productId/flags',
  validate(z.object({ body: bodySchema, params: paramsSchema })),
  asyncHandler(productController.replaceFlags)
);
router.delete(
  '/products/:productId/flags/:flagId',
  validate(z.object({ params: deleteParamsSchema })),
  asyncHandler(productController.removeFlag)
);

module.exports = router;
