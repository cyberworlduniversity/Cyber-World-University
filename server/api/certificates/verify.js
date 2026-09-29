import { ObjectId } from "mongodb";
import { getDatabase } from "../../_lib/db.js";
const json=(res,status,body)=>res.status(status).json(body);
export default async function handler(req,res){
  if(req.method!=="GET") return json(res,405,{ok:false,error:"Method not allowed"});
  try{
    const certificateId=String(req.query?.certificateId||"").trim().toUpperCase();
    if(!certificateId) return json(res,400,{ok:false,verified:false,error:"Certificate ID is required"});
    const db=await getDatabase();
    const certificate=await db.collection("certificates").findOne({certificateId,status:{$ne:"revoked"}});
    if(!certificate) return json(res,404,{ok:true,verified:false,error:"Certificate not found or revoked"});
    const user=certificate.userId instanceof ObjectId?await db.collection("users").findOne({_id:certificate.userId},{projection:{name:1}}):null;
    return json(res,200,{ok:true,verified:true,certificate:{certificateId:certificate.certificateId,studentName:user?.name||"Student",courseTitle:certificate.courseTitle,issuedAt:certificate.issuedAt}});
  }catch(error){console.error("Certificate verification error:",error);return json(res,500,{ok:false,verified:false,error:"Server configuration or database error"});}
}