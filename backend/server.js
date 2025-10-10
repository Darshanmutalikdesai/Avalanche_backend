// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // allow cookies if needed
}));

app.use(express.json());


// 4️⃣ Mount user routes
app.use("/api/users", userRoutes);

// 5️⃣ Default route
app.get("/", (req, res) => {
  res.send("Avalanche Backend is running!");
});

// 6️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
