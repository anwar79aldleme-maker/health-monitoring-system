import { pool } from "./db.js";
import { verifyToken } from "./middleware.js";

export default async function handler(req,res){
  try{
    verifyToken(req,res);

    if(req.method==="GET"){
      const data = await pool.query("SELECT * FROM patients");
      return res.json(data.rows);
    }

    if(req.method==="POST"){
      const { name, phone, email } = req.body;
      await pool.query("INSERT INTO patients(name,phone,email) VALUES($1,$2,$3)",[name,phone,email]);
      return res.json({status:"added"});
    }

    if(req.method==="PUT"){
      const { id,name,phone,email }=req.body;
      await pool.query("UPDATE patients SET name=$1, phone=$2,email=$3 WHERE id=$4",[name,phone,email,id]);
      return res.json({status:"updated"});
    }

    if(req.method==="DELETE"){
      const { id } = req.body;
      await pool.query("DELETE FROM patients WHERE id=$1",[id]);
      return res.json({status:"deleted"});
    }

    res.status(405).end();
  } catch(e){
    res.status(401).json({error:e.message});
  }
}
