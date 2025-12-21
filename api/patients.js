
import pkg from "pg";
const { Client } = pkg;

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  if (req.method === "GET") {
    const r = await client.query("SELECT * FROM patients ORDER BY id DESC");
    await client.end();
    return res.json(r.rows);
  }

  if (req.method === "POST") {
    const { name, phone, email, device } = req.body;
    await client.query(
      "INSERT INTO patients(name,phone,email,device) VALUES($1,$2,$3,$4)",
      [name, phone, email, device]
    );
    await client.end();
    return res.json({ success: true });
  }

  await client.end();
  res.status(405).end();
}
