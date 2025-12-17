import pkg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req,res){
  if(req.method !== "POST") return res.status(405).json({error:"Method Not Allowed"});
  try {
    const { email, password } = req.body;
    const r = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
    if(!r.rows.length) return res.status(401).json({error:"User not found"});
    const user = r.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({error:"Wrong password"});
    const token = jwt.sign({id:user.id,email:user.email}, process.env.JWT_SECRET, {expiresIn:"12h"});
    res.json({token});
  } catch(e) {
    res.status(500).json({error:e.message});
  }
}

