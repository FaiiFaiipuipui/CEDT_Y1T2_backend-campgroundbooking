const mongoose = require("mongoose");

const TransactionSlipSchema = new mongoose.Schema(
  {
    slip_image: {
      /* Encoded in Base64 */
      type: Buffer,         
      required: true
    },
    submit_time: {
      type: Date,
      default: Date.now,
    }
  }
)

// TODO cascade delete?

module.exports = mongoose.model('TransactionSlip', TransactionSlipSchema);