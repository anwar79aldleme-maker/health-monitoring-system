import pkg from "pg";
import jwt from "jsonwebtoken";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔐 Middleware بسيط للتحقق من JWT
function auth(req) {
  const h = req.headers.authorization;
  if (!h) throw "No token";

  const token = h.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req, res) {
  try {
    auth(req);

    // ➕ إضافة جهاز
    if (req.method === "POST") {
      const { device_name, patient_id } = req.body;

      await pool.query(
        "INSERT INTO devices (device_name, patient_id) VALUES ($1,$2)",
        [device_name, patient_id]
      );

      return res.json({ status: "device added" });
    }

    // 📄 عرض كل الأجهزة
    if (req.method === "GET") {
      const r = await pool.query(
        `SELECT d.id, d.device_name, p.name AS patient
         FROM devices d
         JOIN patients p ON d.patient_id=p.id`
      );

      return res.json(r.rows);
    }

    // ✏ تعديل جهاز
    if (req.method === "PUT") {
      const { id, device_name } = req.body;

      await pool.query(
        "UPDATE devices SET device_name=$1 WHERE id=$2",
        [device_name, id]
      );

      return res.json({ status: "device updated" });
    }

    // 🗑 حذف جهاز
    if (req.method === "DELETE") {
      const { id } = req.body;

      await pool.query(
        "DELETE FROM devices WHERE id=$1",
        [id]
      );

      return res.json({ status: "device deleted" });
    }

    res.status(405).json({ error: "Method not allowed" });

  } catch (e) {
    res.status(401).json({ error: e.toString() });
  }
}

