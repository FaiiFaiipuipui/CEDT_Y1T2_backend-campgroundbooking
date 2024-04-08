const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, 'status not indicated'],
      trim: true,
      maxlength: [30, "status length not valid"]
    },

    rent_date: {
      type: Date,
      required: true
    },

    successful_payment_date: {
      type: Date
    },

    slip_images: {
      // TODO Please Check if this declaration is valid or not
      type: [mongoose.Schema.ObjectId],
      ref: "transaction_slip"
    },

    campground: {
      type: mongoose.Schema.ObjectId,
      ref: "Campground",
      required: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: "Appointment",
      required: true,
    }
  }
)

//TODO Cascade delete?

//TODO add virtuals?

module.exports = mongoose.model("Transaction", TransactionSchema);