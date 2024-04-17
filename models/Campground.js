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

    coordinate: {
      type: String,
      required: [true, "Please add a coordinate"],
    },

    province: {
      type: String,
      required: [true, "Please add a province"],
    },

    postalcode: {
      type: String,
      required: [true, "Please add a postal code"],
    },

    telephone: {
      type: String,
      required: [true, "Please add a telephone number"],
    },

    region: {
      type: String,
      required: [true, "Please add a region"],
    },

    picture: {
      type: String,
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Please add a price"],
    },

    //For example: 0819998888 constraint: regex of number only, length must be 10
    promptpayTel: {
      type: String,
      required: [true, "Please add a promptpay's telephone"],
      match: [/^[0-9]{10}$/, "Please input only numbers and length must be 10"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false }
);

// Cascade delete appointments when a campground is deleted
CampgroundSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Appointments being removed from campground ${this._id}`);
    await this.model("Appointment").deleteMany({ campground: this._id });
    next();
  }
);

//Cascade delete announcements when a campground is deleted
CampgroundSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Announcement being removed from campground ${this._id}`);
    await this.model("Announcement").deleteMany({ campground: this._id });
    next();
  }
);

// Appointment populate with virtual
CampgroundSchema.virtual("appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "campground",
  justOne: false,
});

// Announcement populate with virtual
CampgroundSchema.virtual("announcements", {
  ref: "Announcement",
  localField: "_id",
  foreignField: "campground",
  justOne: false,
});

module.exports = mongoose.model("Campground", CampgroundSchema);
