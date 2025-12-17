import jwt from "jsonwebtoken";

export function verifyToken(req,res){
  const authHeader = req.headers.authorization;
  if(!authHeader) throw new Error("No token");

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }
}

