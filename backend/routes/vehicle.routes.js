import express from "express";
import Vehicle from "../models/vehicle.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Register vehicle (OWNER)
router.post("/", auth, async (req, res) => {
  const vehicle = await Vehicle.create({
    ...req.body,
    owner: req.user.id,
  });
  res.json(vehicle);
});



// Get nearby vehicles (SEEKER)
router.get("/", async (req, res) => {try {
    const { city, pincode, type } = req.query;

    // ❌ Validation
    if (!city || !pincode) {
      return res.status(400).json({
        message: "City and pincode are required",
      });
    }

    // ✅ Build dynamic filter
    const filter = {
      city: city.toLowerCase(),
      pincode,
      isAvailable: true,
    };

    // ✅ Optional type filter
    if (type) {
      filter.type = type;
    }

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Get Vehicles Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
