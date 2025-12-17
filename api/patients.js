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
      const result = await client.query("SELECT * FROM patients");
      res.json(result.rows);
    } else if (req.method === "POST") {
      const { name, phone, email, device_name } = req.body;
      const result = await client.query(
        "INSERT INTO patients(name, phone, email, device_name) VALUES($1,$2,$3,$4) RETURNING *",
        [name, phone, email, device_name]
      );
      res.json(result.rows[0]);
    } else if (req.method === "PUT") {
      const { id, name, phone, email, device_name } = req.body;
      const result = await client.query(
        "UPDATE patients SET name=$1, phone=$2, email=$3, device_name=$4 WHERE id=$5 RETURNING *",
        [name, phone, email, device_name, id]
      );
      res.json(result.rows[0]);
    } else if (req.method === "DELETE") {
      const { id } = req.body;
      await client.query("DELETE FROM patients WHERE id=$1", [id]);
      res.json({ success: true });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
