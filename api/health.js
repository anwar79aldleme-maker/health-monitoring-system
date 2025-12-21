
import pkg from "pg";
const { Client } = pkg;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { device, spo2, heartrate } = req.body;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  await client.query(
    "INSERT INTO health(device, spo2, heartrate) VALUES($1,$2,$3)",
    [device, spo2, heartrate]
  );

  await client.end();
  res.json({ success: true });
}
