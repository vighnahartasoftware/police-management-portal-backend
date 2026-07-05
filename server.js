require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/db");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  "https://police-management-port-git-77d0e3-vighnahartasoftwares-projects.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Police City Management Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy",
    time: new Date().toISOString(),
  });
});

const authRoutes = require("./routes/authRoutes");
const religiousPlaceRoutes = require("./routes/religiousPlaceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const festivalRoutes = require("./routes/festivalRoutes");
const policeStationRoutes = require("./routes/policeStationRoutes");
const otherPlaceRoutes = require("./routes/otherPlaceRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/religious-places", religiousPlaceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/festival-permissions", festivalRoutes);
app.use("/api/police-stations", policeStationRoutes);
app.use("/api/other-places", otherPlaceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});