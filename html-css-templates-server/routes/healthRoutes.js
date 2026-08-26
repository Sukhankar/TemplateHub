import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const healthStatus = {
    status: dbState === 1 ? "UP" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || "unknown",
      connected: dbState === 1,
    },
    environment: process.env.NODE_ENV || "development",
  };

  res.status(dbState === 1 ? 200 : 503).json(healthStatus);
});

export default router;
