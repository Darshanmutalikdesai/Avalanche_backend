import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js"; // ✅ Add event routes
import paperPresentationRoutes from "./src/routes/paperPresentationRoutes.js"; // ✅ Paper Presentation routes
import mongoose from "mongoose"; // ✅ Needed for MongoDB cleanup

dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json()); // JSON parsing

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes); // ✅ Add events route
app.use("/api/paper-presentation", paperPresentationRoutes); // ✅ Paper Presentation routes

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🚀 Avalanche Backend is running successfully!");
});

// ✅ Global Error Handler (optional but useful)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: err.message,
  });
});

// ✅ MongoDB Cleanup Script (Run Once)
const runMongoCleanup = async () => {
  if (process.env.RUN_ONCE === "true") {
    try {
      const db = mongoose.connection.db;

      // Drop old event_id index
      try {
        await db.collection("events").dropIndex("event_id_1");
        console.log("✅ Old event_id index dropped");
      } catch (e) {
        console.log("ℹ️ No old event_id index found, skipping drop");
      }

      // Remove documents with null event_id (optional)
      const deleteResult = await db.collection("events").deleteMany({ event_id: null });
      console.log(`✅ Removed ${deleteResult.deletedCount} old documents with null event_id`);

      // Create unique index on eventCode
      await db.collection("events").createIndex({ eventCode: 1 }, { unique: true });
      console.log("✅ Unique index on eventCode ensured");
    } catch (error) {
      console.error("❌ MongoDB cleanup error:", error);
    }
  }
};

// Run cleanup if RUN_ONCE=true
runMongoCleanup();

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
