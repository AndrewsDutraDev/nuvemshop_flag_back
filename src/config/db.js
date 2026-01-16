const mongoose = require('mongoose');
const { log } = require('../utils/logger');

async function connect(mongodbUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongodbUri, {
    autoIndex: true
  });
  log('info', 'MongoDB connected');
}

module.exports = { connect };
