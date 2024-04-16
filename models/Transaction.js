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

    submitted_slip_images: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransactionSlip"
      }],
      default: []
    },

    successful_payment_slip_image: {
      type: mongoose.Schema.ObjectId,
      ref: "TransactionSlip",
      default: null
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false }
)

// Cascade delete appointments when a transaction is deleted
TransactionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Transaction Slip being removed from transaction ${this._id}`);
    await this.model("TransactionSlip").deleteMany({ transaction: this._id });
    next();
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);