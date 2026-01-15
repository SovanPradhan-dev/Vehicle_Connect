import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
