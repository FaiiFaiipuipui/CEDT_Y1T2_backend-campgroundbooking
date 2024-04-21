const mongoose = require("mongoose");

const TransactionSlipSchema = new mongoose.Schema(
  {
    slip_image: {
      /* Encoded in Base64 Note That: Front End convert to base64 
      or others type that Buffer.form is able to convert to Buffer type*/
      type: Buffer,
      required: true
    },
    submit_time: {
      type: Date,
      default: Date.now,
    },
    payment_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Transaction",
      required: true,
    }
  }
)

module.exports = mongoose.model('TransactionSlip', TransactionSlipSchema);