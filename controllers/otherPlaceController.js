const db = require("../config/db");

exports.createOtherPlace = (req, res) => {
  const {
    place_name,
    category,
    owner_name,
    mobile,
    address,
    area,
    latitude,
    longitude,
    google_map_link,
    notes,
  } = req.body;

  if (!place_name || !category) {
    return res.status(400).json({
      success: false,
      message: "Place name and category are required",
    });
  }

  const sql = `
    INSERT INTO other_places
    (place_name, category, owner_name, mobile, address, area, latitude, longitude, google_map_link, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    place_name,
    category,
    owner_name || null,
    mobile || null,
    address || null,
    area || null,
    latitude || null,
    longitude || null,
    google_map_link || null,
    notes || null,
    req.officer.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to add other place",
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Other place added successfully",
      id: result.insertId,
    });
  });
};

exports.getOtherPlaces = (req, res) => {
  db.query("SELECT * FROM other_places ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch other places",
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

exports.deleteOtherPlace = (req, res) => {
  db.query("DELETE FROM other_places WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Delete failed",
      });
    }

    res.json({
      success: true,
      message: "Other place deleted",
    });
  });
};