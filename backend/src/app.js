// src/app.js
import express from "express";
import cors from "cors";

import { env } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log("Server running on port " + env.PORT);
});
