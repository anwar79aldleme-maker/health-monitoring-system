import { pool } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).end();

  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
  if(user.rows.length===0) return res.status(401).json({error:"Invalid email"});

  const valid = await bcrypt.compare(password,user.rows[0].password);
  if(!valid) return res.status(401).json({error:"Invalid password"});

  const token = jwt.sign({id:user.rows[0].id,email:user.rows[0].email}, process.env.JWT_SECRET, {expiresIn:"1h"});
  res.json({token});
}

