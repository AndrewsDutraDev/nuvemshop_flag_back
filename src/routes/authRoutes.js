const express = require('express');
const { z } = require('zod');
const { validate } = require('../middlewares/validate');
const { asyncHandler } = require('../utils/asyncHandler');
const { loginController, meController } = require('../controllers/authController');
const { authRequired } = require('../middlewares/auth');

const router = express.Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    store_id: z.string().optional()
  })
});

router.post('/auth/login', validate(loginSchema), asyncHandler(loginController));
router.get('/me', authRequired, asyncHandler(meController));

module.exports = router;
