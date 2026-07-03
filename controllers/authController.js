const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.loginOfficer = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  const sql = "SELECT * FROM officers WHERE username = ? AND status = 'Active'";

  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const officer = results[0];

    const isMatch = await bcrypt.compare(password, officer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: officer.id,
        username: officer.username,
        role: officer.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      officer: {
        id: officer.id,
        full_name: officer.full_name,
        username: officer.username,
        role: officer.role,
        police_station: officer.police_station,
      },
    });
  });
};