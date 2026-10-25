import express from "express";
import Vehicle from "../models/vehicle.model.js";
import Booking from "../models/booking.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Owner vehicles
router.get("/vehicles", auth, async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user.id });
  res.json(vehicles);
});

// Toggle availability
// Toggle availability (OWNER ONLY)
router.patch("/vehicles/:id/availability", auth, async (req, res) => {
  try {
    console.log("🔥 Toggle request:", req.params.id);

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    vehicle.isAvailable = !vehicle.isAvailable;
    await vehicle.save();

    console.log(" Updated:", vehicle.isAvailable);
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error("Availability error:", err);
    res.status(500).json({ msg: "Failed to update availability by server" });
  }
});


// Booking requests
router.get("/requests", auth, async (req, res) => {
  const requests = await Booking.find({ owner: req.user.id })
    .populate("vehicle", "type pricePerKm city")
    .populate("seeker", "name email");
  res.json(requests);
});

// Accept / Reject booking
router.patch("/requests/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id).populate("vehicle");
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }
    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ msg: "Booking already processed" });
    }

    booking.status = status;

    if (status === "accepted") {
      await Vehicle.findByIdAndUpdate(booking.vehicle._id || booking.vehicle, {
        isAvailable: false,
      });
    } else if (status === "rejected") {
      // Make vehicle available again if it was marked unavailable on request creation
      await Vehicle.findByIdAndUpdate(booking.vehicle._id || booking.vehicle, {
        isAvailable: true,
      });
    }

    await booking.save();
    const updatedBooking = await Booking.findById(booking._id)
      .populate("vehicle", "type pricePerKm city")
      .populate("seeker", "name email");
    res.json({ success: true, request: updatedBooking });
  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ msg: "Failed to update request" });
  }
});

export default router;
