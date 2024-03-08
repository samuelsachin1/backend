// routes/payment.js

const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// Route to update payment status
router.post('/updatePaymentStatus', async (req, res) => {
  try {
    const { billId, ispaid } = req.body;

    // Update payment status in the database
    const updatedPayment = await Payment.findByIdAndUpdate(
      billId,
      { ispaid: ispaid },
      { new: true }
    );

    if (updatedPayment) {
      res.json({ success: true, message: 'Payment status updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Payment not found.' });
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
