const db = require("../config/db");

exports.createPoliceStation = (req, res) => {
  const {
    station_name,
    station_code,
    city,
    district,
    state,
    contact_number,
    station_head,
    address,
    latitude,
    longitude,
    status,
  } = req.body;

  if (!station_name || !station_code) {
    return res.status(400).json({
      success: false,
      message: "Station name and station code are required",
    });
  }

  const sql = `
    INSERT INTO police_stations
    (station_name, station_code, city, district, state, contact_number, station_head, address, latitude, longitude, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    station_name,
    station_code,
    city,
    district,
    state,
    contact_number,
    station_head,
    address,
    latitude || null,
    longitude || null,
    status || "Active",
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to create police station",
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Police station created successfully",
      id: result.insertId,
    });
  });
};

exports.getPoliceStations = (req, res) => {
  const sql = "SELECT * FROM police_stations ORDER BY station_name ASC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch police stations",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

exports.deletePoliceStation = (req, res) => {
  db.query("DELETE FROM police_stations WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete police station",
      });
    }

    res.status(200).json({
      success: true,
      message: "Police station deleted successfully",
    });
  });
};