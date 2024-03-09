const mongoose = require('mongoose');

const customerMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CustomerMessage = mongoose.model('CustomerMessage', customerMessageSchema);

module.exports = CustomerMessage;
