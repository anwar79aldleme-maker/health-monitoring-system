import pkg from "pg";
import jwt from "jsonwebtoken";

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// تحقق من JWT
function auth(req) {
  const h = req.headers.authorization;
  if(!h) throw "No token";
  const token = h.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req,res){
  try{
    auth(req);
    const { name,email,phone,id } = req.body;

    if(req.method==="POST"){
      await pool.query(
        "INSERT INTO patients(name,email,phone) VALUES($1,$2,$3)",
        [name,email,phone]
      );
      return res.json({status:"Patient added"});
    }

    if(req.method==="GET"){
      const r = await pool.query("SELECT * FROM patients");
      return res.json(r.rows);
    }

    if(req.method==="PUT"){
      await pool.query(
        "UPDATE patients SET name=$1,email=$2,phone=$3 WHERE id=$4",
        [name,email,phone,id]
      );
      return res.json({status:"Patient updated"});
    }

    if(req.method==="DELETE"){
      await pool.query("DELETE FROM patients WHERE id=$1",[id]);
      return res.json({status:"Patient deleted"});
    }

    res.status(405).json({error:"Method not allowed"});

  } catch(e){
    res.status(401).json({error:e.toString()});
  }
}
