import pkg from "pg";
import jwt from "jsonwebtoken";

const { Client } = pkg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "GET") {
      const result = await client.query("SELECT * FROM health ORDER BY recorded_at DESC");
      res.json(result.rows);
    } else if (req.method === "POST") {
      const { patient_id, spo2, heartrate } = req.body;
      const result = await client.query(
        "INSERT INTO health(patient_id, spo2, heartrate) VALUES($1,$2,$3) RETURNING *",
        [patient_id, spo2, heartrate]
      );
      res.json(result.rows[0]);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
