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
    const { device_name, patient_id, id }=req.body;

    if(req.method==="POST"){
      await pool.query("INSERT INTO devices(device_name,patient_id) VALUES($1,$2)",[device_name,patient_id]);
      return res.json({status:"Device added"});
    }

    if(req.method==="GET"){
      const r=await pool.query("SELECT d.id,d.device_name,p.name AS patient FROM devices d JOIN patients p ON d.patient_id=p.id");
      return res.json(r.rows);
    }

    if(req.method==="PUT"){
      await pool.query("UPDATE devices SET device_name=$1,patient_id=$2 WHERE id=$3",[device_name,patient_id,id]);
      return res.json({status:"Device updated"});
    }

    if(req.method==="DELETE"){
      await pool.query("DELETE FROM devices WHERE id=$1",[id]);
      return res.json({status:"Device deleted"});
    }

    res.status(405).json({error:"Method not allowed"});
  }catch(e){
    res.status(401).json({error:e.toString()});
  }
}
