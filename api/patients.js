import pkg from "pg";
import jwt from "jsonwebtoken";

const { Client } = pkg;

// تنفيذ الاتصال بـ Postgres
async function getClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  return client;
}

// دالة للتحقق من توكن JWT
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  const user = verifyToken(req);
  // إذا التوكن غير موجود أو غير صالح → رفض الطلب
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const client = await getClient();

    if (req.method === "GET") {
      const result = await client.query("SELECT * FROM patients ORDER BY id DESC");
      res.status(200).json(result.rows);

    } else if (req.method === "POST") {
      const { name, phone, email, device_name } = req.body;
      const result = await client.query(
        `INSERT INTO patients(name, phone, email, device_name)
         VALUES($1, $2, $3, $4) RETURNING *`,
        [name, phone, email, device_name]
      );
      res.status(201).json(result.rows[0]);

    } else if (req.method === "PUT") {
      const { id, name, phone, email, device_name } = req.body;
      const result = await client.query(
        `UPDATE patients SET name=$1, phone=$2, email=$3, device_name=$4
         WHERE id=$5 RETURNING *`,
        [name, phone, email, device_name, id]
      );
      res.status(200).json(result.rows[0]);

    } else if (req.method === "DELETE") {
      const { id } = req.body;
      await client.query("DELETE FROM patients WHERE id=$1", [id]);
      res.status(200).json({ success: true });

    } else {
      res.status(405).json({ error: "Method not allowed" });
    }

    await client.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
