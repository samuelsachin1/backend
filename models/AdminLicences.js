const mongoose = require('mongoose');

const adminLicenseSchema = new mongoose.Schema({
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

const AdminLicense = mongoose.model('AdminLicense', adminLicenseSchema);

module.exports = AdminLicense;
