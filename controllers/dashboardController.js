const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const { police_station } = req.query;

  const stationCondition = police_station ? "WHERE police_station = ?" : "";
  const values = police_station ? [police_station] : [];

  const countQuery = (extra = "") => `
    SELECT COUNT(*) AS total 
    FROM religious_places 
    ${stationCondition}
    ${
      stationCondition && extra
        ? "AND " + extra
        : !stationCondition && extra
        ? "WHERE " + extra
        : ""
    }
  `;

  const festivalCountQuery = `
    SELECT COUNT(*) AS total FROM festival_permissions
  `;

  db.query(countQuery(), values, (err1, totalResult) => {
    if (err1) return res.status(500).json({ success: false, message: "Dashboard error" });

    db.query(countQuery("place_type='Temple'"), values, (e2, temples) => {
      db.query(countQuery("place_type='Masjid'"), values, (e3, masjids) => {
        db.query(countQuery("place_type='Dargah'"), values, (e4, dargahs) => {
          db.query(countQuery("risk_level='High'"), values, (e5, highRisk) => {
            db.query(festivalCountQuery, (e6, festivalTotal) => {
              db.query(
                `SELECT * FROM religious_places ${stationCondition} ORDER BY id DESC`,
                values,
                (e7, religiousPlaces) => {
                  db.query(
                    `
                    SELECT fp.*, rp.place_name
                    FROM festival_permissions fp
                    LEFT JOIN religious_places rp ON fp.religious_place_id = rp.id
                    ORDER BY fp.id DESC
                    `,
                    (e8, festivalPermissions) => {
                      res.json({
                        success: true,
                        stats: {
                          totalPlaces: totalResult[0].total,
                          temples: temples[0].total,
                          masjids: masjids[0].total,
                          dargahs: dargahs[0].total,
                          highRisk: highRisk[0].total,
                          festivalPermissions: festivalTotal[0].total,
                        },
                        religiousPlaces,
                        festivalPermissions,
                      });
                    }
                  );
                }
              );
            });
          });
        });
      });
    });
  });
};