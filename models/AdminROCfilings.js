const mongoose = require('mongoose');

const adminROCSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
    unique: true,
  },
  fieldDescription: {
    type: String,
    required: true,
  },
});

const AdminROCfilings = mongoose.model('AdminROC', adminROCSchema);

module.exports = AdminROCfilings;
