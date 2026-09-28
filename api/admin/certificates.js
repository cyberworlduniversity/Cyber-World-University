import { ObjectId } from "mongodb";
import { getDatabase } from "../_lib/db.js";
const json=(r,s,b)=>r.status(s).json(b);
function token(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)cwu_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function user(req){const t=token(req);if(!t)return null;const db=await getDatabase();const s=await db.collection("sessions").findOne({token:t});return s?db.collection("users").findOne({_id:s.userId}):null}
const escapeRegex=s=>String(s).replaceAll("\\","\\\\").replaceAll(".","\\.").replaceAll("*","\\*").replaceAll("+","\\+").replaceAll("?","\\?").replaceAll("^","\\^").replaceAll("$","\\$").replaceAll("{","\\{").replaceAll("}","\\}").replaceAll("(","\\(").replaceAll(")","\\)").replaceAll("[","\\[").replaceAll("]","\\]").replaceAll("|","\\|");
export default async function handler(req,res){
 try{
  const u=await user(req);if(!u)return json(res,401,{ok:false,error:"Not authenticated"});if(u.role!=="admin")return json(res,403,{ok:false,error:"Administrator access required"});
  const db=await getDatabase(),c=db.collection("certificates");
  if(req.method==="GET"){
   const q=String(req.query?.q||"").trim(),safe=escapeRegex(q);
   const filter=q?{$or:[{certificateId:{$regex:safe,$options:"i"}},{courseTitle:{$regex:safe,$options:"i"}}]}:{};
   const rows=await c.find(filter).sort({issuedAt:-1}).limit(100).toArray();
   const userIds=[...new Set(rows.map(x=>x.userId).filter(Boolean).map(x=>x.toString()))].filter(ObjectId.isValid).map(x=>new ObjectId(x));
   const users=userIds.length?await db.collection("users").find({_id:{$in:userIds}}).project({name:1,email:1}).toArray():[];
   const um=new Map(users.map(x=>[x._id.toString(),x]));
   return json(res,200,{ok:true,certificates:rows.map(x=>{const s=um.get(String(x.userId));return {id:x._id.toString(),certificateId:x.certificateId,studentName:s?.name||"Student",studentEmail:s?.email||"",courseId:String(x.courseId||""),courseTitle:x.courseTitle||"Course",issuedAt:x.issuedAt,status:x.status==="revoked"?"revoked":"active",revokedAt:x.revokedAt||null}})});
  }
  if(req.method==="PATCH"){
   const id=String(req.query?.id||"");if(!ObjectId.isValid(id))return json(res,400,{ok:false,error:"Valid certificate id is required"});
   const status=req.body?.status==="revoked"?"revoked":"active";
   const result=await c.updateOne({_id:new ObjectId(id)},{$set:{status,...(status==="revoked"?{revokedAt:new Date()}:{revokedAt:null})}});
   if(!result.matchedCount)return json(res,404,{ok:false,error:"Certificate not found"});
   return json(res,200,{ok:true,status});
  }
  return json(res,405,{ok:false,error:"Method not allowed"});
 }catch(e){console.error("Admin certificates API error:",e);return json(res,500,{ok:false,error:"Server configuration or database error"})}
}