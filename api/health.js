import pkg from "pg";
import jwt from "jsonwebtoken";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{ rejectUnauthorized:false }
});

function auth(req){
  const h=req.headers.authorization;
  if(!h) throw "No token";
  const token=h.split(" ")[1];
  return jwt.verify(token,process.env.JWT_SECRET);
}

export default async function handler(req,res){
  try{
    auth(req);
    const { device_id, spo2, heartrate } = req.body;

    if(req.method==="POST"){
      await pool.query("INSERT INTO health(device_id,spo2,heartrate,created_at) VALUES($1,$2,$3,NOW())",[device_id,spo2,heartrate]);
      return res.json({status:"Data added"});
    }

    if(req.method==="GET"){
      const r=await pool.query(`SELECT h.*, d.device_name, p.name AS patient
                                FROM health h
                                JOIN devices d ON h.device_id=d.id
                                JOIN patients p ON d.patient_id=p.id
                                ORDER BY h.created_at DESC`);
      return res.json(r.rows);
    }

    res.status(405).json({error:"Method not allowed"});

  }catch(e){
    res.status(401).json({error:e.toString()});
  }
}
