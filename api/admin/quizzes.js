import { ObjectId } from "mongodb";
import { getDatabase } from "../_lib/db.js";
const oid=v=>typeof v==="string"&&ObjectId.isValid(v)?new ObjectId(v):null;
const clean=(v,n=200)=>typeof v==="string"?v.trim().slice(0,n):"";
function json(r,s,b){r.status(s).json(b)}
function token(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)cwu_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function user(req){const t=token(req);if(!t)return null;const db=await getDatabase();const s=await db.collection("sessions").findOne({token:t});return s?db.collection("users").findOne({_id:s.userId}):null}
function map(x){return {...x,id:x._id.toString(),courseId:x.courseId.toString()}}
export default async function handler(req,res){
 try{const u=await user(req);if(!u)return json(res,401,{ok:false,error:"Not authenticated"});if(u.role!=="admin")return json(res,403,{ok:false,error:"Administrator access required"});const db=await getDatabase(),q=db.collection("quizzes");
  if(req.method==="GET"){const rows=await q.find(oid(req.query?.courseId)?{courseId:oid(req.query.courseId)}:{}).sort({createdAt:-1}).toArray();return json(res,200,{ok:true,quizzes:rows.map(map)})}
  if(req.method==="POST"){const b=req.body||{},courseId=oid(b.courseId),title=clean(b.title,160);if(!courseId||!title)return json(res,400,{ok:false,error:"Course and quiz title are required"});const doc={courseId,title,description:clean(b.description,1000),questionCount:Math.max(1,Number(b.questionCount)||10),timeLimitMinutes:Math.max(1,Number(b.timeLimitMinutes)||10),passPercent:Math.min(100,Math.max(1,Number(b.passPercent)||70)),maxAttempts:Math.max(1,Number(b.maxAttempts)||1),randomize:b.randomize!==false,status:b.status==="published"?"published":"draft",createdAt:new Date(),updatedAt:new Date()};const r=await q.insertOne(doc);return json(res,201,{ok:true,quiz:map({...doc,_id:r.insertedId})})}
  if(req.method==="PUT"){const id=oid(req.query?.id);if(!id)return json(res,400,{ok:false,error:"Valid quiz id is required"});const b=req.body||{},set={updatedAt:new Date()};["title","description"].forEach(k=>{if(b[k]!==undefined)set[k]=clean(b[k],k==="title"?160:1000)});["questionCount","timeLimitMinutes","passPercent","maxAttempts"].forEach(k=>{if(b[k]!==undefined)set[k]=Math.max(1,Number(b[k])||1)});if(b.passPercent!==undefined)set.passPercent=Math.min(100,set.passPercent);if(typeof b.randomize==="boolean")set.randomize=b.randomize;if(b.status==="draft"||b.status==="published")set.status=b.status;const r=await q.findOneAndUpdate({_id:id},{$set:set},{returnDocument:"after"});return r?json(res,200,{ok:true,quiz:map(r)}):json(res,404,{ok:false,error:"Quiz not found"})}
  if(req.method==="DELETE"){const id=oid(req.query?.id);if(!id)return json(res,400,{ok:false,error:"Valid quiz id is required"});await q.deleteOne({_id:id});return json(res,200,{ok:true})}
  return json(res,405,{ok:false,error:"Method not allowed"});
 }catch(e){console.error("Quiz API error:",e);return json(res,500,{ok:false,error:"Server configuration or database error"})}
}