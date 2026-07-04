const db = require("../config/db");

exports.createFestivalPermission = (req, res) => {
  const {
    religious_place_id,
    festival_name,
    festival_year,
    organizer_name,
    president_name,
    president_mobile,
    permission_number,
    start_date,
    end_date,
    start_time,
    end_time,
    expected_crowd,
    sound_permission,
    procession,
    route_details,
    address,
    area,
    taluka,
    district,
    state,
    pincode,
    latitude,
    longitude,
    google_map_link,
    verification_status,
    permission_status,
    police_notes,
  } = req.body;

  if (!festival_name || !organizer_name) {
    return res.status(400).json({
      success: false,
      message: "Festival name and mandal name are required",
    });
  }

  const photo = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO festival_permissions
    (
      religious_place_id, festival_name, festival_year, organizer_name,
      president_name, president_mobile, permission_number,
      start_date, end_date, start_time, end_time,
      expected_crowd, sound_permission, procession, route_details,
      address, area, taluka, district, state, pincode,
      latitude, longitude, google_map_link, photo,
      verification_status, permission_status, assigned_officer, police_notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    religious_place_id || null,
    festival_name,
    festival_year || new Date().getFullYear(),
    organizer_name,
    president_name || null,
    president_mobile || null,
    permission_number || null,
    start_date || null,
    end_date || null,
    start_time || null,
    end_time || null,
    expected_crowd || 0,
    sound_permission === "Yes" ? 1 : 0,
    procession === "Yes" ? 1 : 0,
    route_details || null,
    address || null,
    area || null,
    taluka || null,
    district || null,
    state || null,
    pincode || null,
    latitude || null,
    longitude || null,
    google_map_link || null,
    photo,
    verification_status || "Pending",
    permission_status || "Pending",
    req.officer.id,
    police_notes || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to create festival permission",
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Festival permission created successfully",
      id: result.insertId,
    });
  });
};

exports.getFestivalPermissions = (req, res) => {
  const sql = `
    SELECT 
      fp.*,
      rp.place_name,
      rp.place_type,
      rp.area AS permanent_area,
      rp.latitude AS permanent_latitude,
      rp.longitude AS permanent_longitude
    FROM festival_permissions fp
    LEFT JOIN religious_places rp
    ON fp.religious_place_id = rp.id
    ORDER BY fp.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch festival permissions",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

exports.getSingleFestivalPermission = (req, res) => {
  const sql = `
    SELECT 
      fp.*,
      rp.place_name,
      rp.place_type,
      rp.area
    FROM festival_permissions fp
    LEFT JOIN religious_places rp
    ON fp.religious_place_id = rp.id
    WHERE fp.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Festival permission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  });
};

exports.updateFestivalPermission = (req, res) => {
  const {
    religious_place_id,
    festival_name,
    festival_year,
    organizer_name,
    president_name,
    president_mobile,
    permission_number,
    start_date,
    end_date,
    start_time,
    end_time,
    expected_crowd,
    sound_permission,
    procession,
    route_details,
    address,
    area,
    taluka,
    district,
    state,
    pincode,
    latitude,
    longitude,
    google_map_link,
    verification_status,
    permission_status,
    police_notes,
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  let sql = `
    UPDATE festival_permissions SET
      religious_place_id = ?,
      festival_name = ?,
      festival_year = ?,
      organizer_name = ?,
      president_name = ?,
      president_mobile = ?,
      permission_number = ?,
      start_date = ?,
      end_date = ?,
      start_time = ?,
      end_time = ?,
      expected_crowd = ?,
      sound_permission = ?,
      procession = ?,
      route_details = ?,
      address = ?,
      area = ?,
      taluka = ?,
      district = ?,
      state = ?,
      pincode = ?,
      latitude = ?,
      longitude = ?,
      google_map_link = ?,
      verification_status = ?,
      permission_status = ?,
      police_notes = ?
  `;

  const values = [
    religious_place_id || null,
    festival_name,
    festival_year || new Date().getFullYear(),
    organizer_name,
    president_name || null,
    president_mobile || null,
    permission_number || null,
    start_date || null,
    end_date || null,
    start_time || null,
    end_time || null,
    expected_crowd || 0,
    sound_permission === "Yes" || sound_permission === true || sound_permission === "1"
      ? 1
      : 0,
    procession === "Yes" || procession === true || procession === "1" ? 1 : 0,
    route_details || null,
    address || null,
    area || null,
    taluka || null,
    district || null,
    state || null,
    pincode || null,
    latitude || null,
    longitude || null,
    google_map_link || null,
    verification_status || "Pending",
    permission_status || "Pending",
    police_notes || null,
  ];

  if (photo) {
    sql += `,
      photo = ?
    `;
    values.push(photo);
  }

  sql += `
    WHERE id = ?
  `;

  values.push(req.params.id);

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to update festival permission",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Festival permission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Festival permission updated successfully",
    });
  });
};

exports.deleteFestivalPermission = (req, res) => {
  const sql = "DELETE FROM festival_permissions WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete festival permission",
      });
    }

    res.status(200).json({
      success: true,
      message: "Festival permission deleted successfully",
    });
  });
};