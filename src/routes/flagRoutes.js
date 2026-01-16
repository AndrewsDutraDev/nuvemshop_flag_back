const express = require('express');
const { z } = require('zod');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../utils/asyncHandler');
const { authRequired } = require('../middlewares/auth');
const flagController = require('../controllers/flagController');

const router = express.Router();

const conditionSchema = z.object({
  type: z.enum(['sale_price_exists', 'stock_below', 'created_within_days', 'tag_contains']),
  threshold: z.number().optional(),
  value: z.string().optional()
});

const flagBodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(['badge', 'ribbon', 'icon']),
  text: z.string().optional().default(''),
  bgColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  textColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  priority: z.number().int().default(0),
  conditions: z.array(conditionSchema).optional(),
  isActive: z.boolean().default(true)
});

const createSchema = z.object({ body: flagBodySchema });
const updateSchema = z.object({ body: flagBodySchema.partial() });
const listSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});
const idSchema = z.object({ params: z.object({ id: z.string() }) });

router.use(authRequired);

router.post('/flags', validate(createSchema), asyncHandler(flagController.createFlag));
router.get('/flags', validate(listSchema), asyncHandler(flagController.listFlags));
router.get('/flags/:id', validate(idSchema), asyncHandler(flagController.getFlag));
router.put(
  '/flags/:id',
  validate(idSchema.merge(updateSchema)),
  asyncHandler(flagController.updateFlag)
);
router.delete('/flags/:id', validate(idSchema), asyncHandler(flagController.deleteFlag));

module.exports = router;
