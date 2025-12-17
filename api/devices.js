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
      const result = await client.query("SELECT * FROM devices");
      res.json(result.rows);
    } else if (req.method === "POST") {
      const { name, description } = req.body;
      const result = await client.query(
        "INSERT INTO devices(name, description) VALUES($1,$2) RETURNING *",
        [name, description]
      );
      res.json(result.rows[0]);
    } else if (req.method === "PUT") {
      const { id, name, description } = req.body;
      const result = await client.query(
        "UPDATE devices SET name=$1, description=$2 WHERE id=$3 RETURNING *",
        [name, description, id]
      );
      res.json(result.rows[0]);
    } else if (req.method === "DELETE") {
      const { id } = req.body;
      await client.query("DELETE FROM devices WHERE id=$1", [id]);
      res.json({ success: true });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
