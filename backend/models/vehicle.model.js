// models/Vehicle.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Truck", "Van", "Car", "Bike"],
      required: true,
    },
    city: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    pricePerKm: Number,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
