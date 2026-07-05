require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/db");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://police-management-portal-frontend.vercel.app",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Police City Management Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});