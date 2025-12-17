import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Client } = pkg;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  const user = await client.query("SELECT * FROM users WHERE email=$1", [email]);
  if (user.rows.length === 0) return res.status(401).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.status(200).json({ token });
}
