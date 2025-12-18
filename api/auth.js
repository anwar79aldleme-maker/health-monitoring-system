import pkg from "pg";
const { Client } = pkg;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const result = await client.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password]
  );

  await client.end();

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Wrong email or password" });
  }

  res.status(200).json({
    success: true,
    email: result.rows[0].email
  });
}
