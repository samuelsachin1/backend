// models/AdminGSTReturnsField.js

const mongoose = require('mongoose');

const adminGSTReturnsFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const AdminGSTReturnsField = mongoose.model('AdminGSTReturnsField', adminGSTReturnsFieldSchema);

module.exports = AdminGSTReturnsField;
