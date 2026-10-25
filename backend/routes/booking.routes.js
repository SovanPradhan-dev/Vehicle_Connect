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

    // Check if seeker already has a pending/accepted booking for this vehicle
    const existingBooking = await Booking.findOne({
      seeker: req.user.id,
      vehicle: vehicleId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingBooking) {
      return res.status(400).json({ msg: "You already have an active request for this vehicle" });
    }

    const booking = await Booking.create({
      vehicle: vehicleId,
      owner: vehicle.owner,
      seeker: req.user.id,
      city: city || vehicle.city,
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
      .populate("vehicle", "type pricePerKm city isAvailable")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch bookings" });
  }
});

// Owner bookings/requests (alternative route)
router.get("/owner", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate("vehicle", "type pricePerKm city")
      .populate("seeker", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch requests" });
  }
});

// Accept booking
router.patch("/:id/accept", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("vehicle");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    if (booking.owner.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });
    if (booking.status !== "pending") return res.status(400).json({ msg: "Booking already processed" });

    booking.status = "accepted";
    await booking.save();

    await Vehicle.findByIdAndUpdate(booking.vehicle._id || booking.vehicle, { isAvailable: false });

    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to accept booking" });
  }
});

// Reject booking
router.patch("/:id/reject", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("vehicle");
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    if (booking.owner.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });
    if (booking.status !== "pending") return res.status(400).json({ msg: "Booking already processed" });

    booking.status = "rejected";
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to reject booking" });
  }
});

export default router;
