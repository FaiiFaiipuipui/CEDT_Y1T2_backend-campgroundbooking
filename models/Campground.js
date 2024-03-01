const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },

    address: {
      type: String,
      required: [true, "Please add an address"],
    },

    district: {
      type: String,
      required: [true, "Please add a district"],
    },

    province: {
      type: String,
      required: [true, "Please add a province"],
    },

    tel: {
      type: String,
      required: [true, "Please add a telephone number"],
    },

    region: {
      type: String,
      required: [true, "Please add a region"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false }
);

// Reverse populate with virtuals
CampgroundSchema.virtual("appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "campground",
  justOne: false,
});
module.exports = mongoose.model("Campground", CampgroundSchema);
