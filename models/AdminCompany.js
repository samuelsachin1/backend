const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  mainName: String,
  subInputs: [String],
});

const AdminCompany = mongoose.model('AdminCompany', companySchema);

module.exports = AdminCompany;
