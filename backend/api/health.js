import { pool } from "./db.js";
import { verifyToken } from "./middleware.js";

export default async function handler(req,res){
  try{
    verifyToken(req,res);

    if(req.method==="POST"){
      const { device_id, spo2, heart_rate } = req.body;
      await pool.query("INSERT INTO health_data(device_id,spo2,heart_rate) VALUES($1,$2,$3)",[device_id,spo2,heart_rate]);
      return res.json({status:"success"});
    }

    if(req.method==="GET"){
      const data = await pool.query(`
        SELECT health_data.*, devices.device_name, patients.name
        FROM health_data
        JOIN devices ON devices.id=health_data.device_id
        JOIN patients ON patients.id=devices.patient_id
        ORDER BY created_at DESC LIMIT 50
      `);
      return res.json(data.rows);
    }

    res.status(405).end();
  } catch(e){
    res.status(401).json({error:e.message});
  }
}

