require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { getEnv } = require('./utils/env');
const { requestLogger } = require('./middlewares/requestLogger');
const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const flagRoutes = require('./routes/flagRoutes');
const productRoutes = require('./routes/productRoutes');
const publicRoutes = require('./routes/publicRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();
const env = getEnv();

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin === '*' ? '*' : env.corsOrigin.split(',').map((o) => o.trim()),
    credentials: env.corsOrigin !== '*'
  })
);
app.use(requestLogger);

const publicLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/public', publicLimiter, publicRoutes);
app.use(authRoutes);
app.use(flagRoutes);
app.use(productRoutes);
app.use(webhookRoutes);
app.use(oauthRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

app.use(errorHandler);

module.exports = { app };
