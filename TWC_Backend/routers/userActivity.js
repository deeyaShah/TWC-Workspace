import express from "express";
import UserActivity from "../Models/UserActivity.js";

const router = express.Router();

// GET all activity logs
router.get("/user-activity", async (req, res) => {
  try {
    const activityLogs = await UserActivity.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(activityLogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// POST a new activity log
router.post("/user-activity", async (req, res) => {
  try {
    const newLog = new UserActivity(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create activity log" });
  }
});

// PUT (update) an activity log
router.put('/user-activity/:id', async (req, res) => {
    try {
      const updated = await UserActivity.findByIdAndUpdate(
        req.params.id,
        {
          ipAddress: req.body.ipAddress,
          userAgent: req.body.userAgent,
        },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.json(updated);
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// DELETE an activity log
router.delete("/user-activity/:id", async (req, res) => {
  try {
    const deletedLog = await UserActivity.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ error: "Activity log not found" });
    }
    res.json({ message: "Activity log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete activity log" });
  }
});

export default router;
