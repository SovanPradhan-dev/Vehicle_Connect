import express from "express";
import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Create booking (SEEKER)
router.post("/", auth, async (req, res) => {
  try {
    const { vehicleId, city } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ msg: "Invalid vehicle ID" });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle || !vehicle.isAvailable) {
      return res.status(400).json({ msg: "Vehicle not available" });
    }

    // Optional: Mark vehicle as unavailable immediately
    vehicle.isAvailable = false;
    await vehicle.save();

    const booking = await Booking.create({
      vehicle: vehicleId,
      owner: vehicle.owner,
      seeker: req.user.id,
      city,
      status: "pending",
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ msg: "Failed to create booking" });
  }
});

// Seeker bookings
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ seeker: req.user.id })
      .populate("vehicle", "type capacity city isAvailable");
    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch bookings" });
  }
});

export default router;
