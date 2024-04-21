const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  apptDate: {
    type: Date,
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  campground: {
    type: mongoose.Schema.ObjectId,
    ref: "Campground",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Cascade update transaction's status: CANCEL when appointment deleted
AppointmentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`transaction which has appointmentID: ${this._id}, status: CANCELED`);
    await this.model("Transaction").updateMany({appointment: this._id},{status: "CANCELED"});
    next();
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
