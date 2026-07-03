const db = require("../config/db");

exports.createReligiousPlace = (req, res) => {
  const {
    place_name,
    religion,
    place_type,
    address,
    area,
    ward,
    taluka,
    district,
    state,
    pincode,
    latitude,
    longitude,
    google_map_link,
    police_station,
    regular_crowd,
    special_day_crowd,
    risk_level,
    contact_person,
    contact_mobile,
    president_name,
    secretary_name,
    committee_details,
    sensitive_notes,
  } = req.body;

  if (!place_name || !place_type) {
    return res.status(400).json({
      success: false,
      message: "Place name and place type are required",
    });
  }

  const duplicateSql = `
    SELECT id, place_name 
    FROM religious_places 
    WHERE place_name = ? 
       OR (latitude = ? AND longitude = ?)
    LIMIT 1
  `;

  db.query(duplicateSql, [place_name, latitude, longitude], (dupErr, dupResult) => {
    if (dupErr) {
      return res.status(500).json({ success: false, message: "Duplicate check failed" });
    }

    if (dupResult.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Religious place already exists",
        existing: dupResult[0],
      });
    }

    const image = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO religious_places
      (
        place_name, religion, place_type, address, area, ward, taluka,
        district, state, pincode, latitude, longitude, google_map_link,
        police_station, regular_crowd, special_day_crowd, risk_level,
        contact_person, contact_mobile, president_name, secretary_name,
        committee_details, sensitive_notes, image, created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      place_name,
      religion,
      place_type,
      address,
      area,
      ward,
      taluka,
      district,
      state,
      pincode,
      latitude || null,
      longitude || null,
      google_map_link,
      police_station,
      regular_crowd,
      special_day_crowd,
      risk_level,
      contact_person,
      contact_mobile,
      president_name,
      secretary_name,
      committee_details,
      sensitive_notes,
      image,
      req.officer.id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to create religious place",
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Religious place created successfully",
        id: result.insertId,
      });
    });
  });
};

exports.getReligiousPlaces = (req, res) => {
  const sql = "SELECT * FROM religious_places ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch religious places",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

exports.getSingleReligiousPlace = (req, res) => {
  const sql = "SELECT * FROM religious_places WHERE id = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Religious place not found",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

exports.updateReligiousPlace = (req, res) => {
  const sql = `
    UPDATE religious_places SET
      place_name = ?,
      religion = ?,
      place_type = ?,
      address = ?,
      area = ?,
      ward = ?,
      police_station = ?,
      regular_crowd = ?,
      special_day_crowd = ?,
      risk_level = ?,
      contact_person = ?,
      contact_mobile = ?,
      president_name = ?,
      secretary_name = ?,
      committee_details = ?,
      sensitive_notes = ?
    WHERE id = ?
  `;

  const values = [
    req.body.place_name,
    req.body.religion,
    req.body.place_type,
    req.body.address,
    req.body.area,
    req.body.ward,
    req.body.police_station,
    req.body.regular_crowd,
    req.body.special_day_crowd,
    req.body.risk_level,
    req.body.contact_person,
    req.body.contact_mobile,
    req.body.president_name,
    req.body.secretary_name,
    req.body.committee_details,
    req.body.sensitive_notes,
    req.params.id,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to update religious place",
      });
    }

    res.status(200).json({
      success: true,
      message: "Religious place updated successfully",
    });
  });
};

exports.deleteReligiousPlace = (req, res) => {
  const sql = "DELETE FROM religious_places WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete religious place",
      });
    }

    res.status(200).json({
      success: true,
      message: "Religious place deleted successfully",
    });
  });
};