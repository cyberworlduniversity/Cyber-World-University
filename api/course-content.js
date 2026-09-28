import { ObjectId } from "mongodb";
import { getDatabase } from "./_lib/db.js";
function json(res,status,body){res.status(status).json(body)}
function token(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)cwu_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function user(req){const t=token(req);if(!t)return null;const db=await getDatabase();const s=await db.collection("sessions").findOne({token:t});if(!s)return null;return db.collection("users").findOne({_id:s.userId})}
function clean(v,max=5000){return typeof v==="string"?v.trim().slice(0,max):""}
function oid(v){return typeof v==="string"&&ObjectId.isValid(v)?new ObjectId(v):null}
function mapPhase(x){return {id:x._id.toString(),courseId:x.courseId.toString(),title:x.title,description:x.description||"",order:x.order||0,status:x.status||"draft"}}
function mapLesson(x){return {id:x._id.toString(),courseId:x.courseId.toString(),phaseId:x.phaseId.toString(),title:x.title,description:x.description||"",order:x.order||0,status:x.status||"draft",duration:x.duration||"",videoUrl:x.videoUrl||"",materials:x.materials||[]}}
export default async function handler(req,res){
 try{
  const db=await getDatabase(), phases=db.collection("course_phases"), lessons=db.collection("lessons");
  const courseId=oid(req.query?.courseId||req.body?.courseId); if(!courseId)return json(res,400,{ok:false,error:"Valid courseId is required"});
  if(req.method==="GET"){
   const admin=req.query?.admin==="true"; if(admin){const u=await user(req);if(!u)return json(res,401,{ok:false,error:"Not authenticated"});if(u.role!=="admin")return json(res,403,{ok:false,error:"Administrator access required"})}
   const phaseQuery=admin?{courseId}:{courseId,status:"published"};
   const ps=await phases.find(phaseQuery).sort({order:1,createdAt:1}).toArray();
   const phaseIds=ps.map(x=>x._id); const lq=admin?{courseId}:{courseId,status:"published"};
   const ls=await lessons.find(lq).sort({order:1,createdAt:1}).toArray();
   return json(res,200,{ok:true,phases:ps.map(mapPhase),lessons:ls.map(mapLesson)});
  }
  const u=await user(req);if(!u)return json(res,401,{ok:false,error:"Not authenticated"});if(u.role!=="admin")return json(res,403,{ok:false,error:"Administrator access required"});
  if(req.method==="POST"){
   const body=req.body||{},type=body.type;
   if(type==="phase"){const title=clean(body.title,160);if(!title)return json(res,400,{ok:false,error:"Phase title is required"});const count=await phases.countDocuments({courseId});const doc={courseId,title,description:clean(body.description,2000),order:Number.isInteger(Number(body.order))?Number(body.order):count+1,status:body.status==="published"?"published":"draft",createdAt:new Date(),updatedAt:new Date()};const r=await phases.insertOne(doc);return json(res,201,{ok:true,phase:mapPhase({...doc,_id:r.insertedId})})}
   if(type==="lesson"){const phaseId=oid(body.phaseId);if(!phaseId)return json(res,400,{ok:false,error:"Valid phaseId is required"});const title=clean(body.title,160);if(!title)return json(res,400,{ok:false,error:"Lesson title is required"});const count=await lessons.countDocuments({courseId,phaseId});const doc={courseId,phaseId,title,description:clean(body.description,3000),order:Number.isInteger(Number(body.order))?Number(body.order):count+1,status:body.status==="published"?"published":"draft",duration:clean(body.duration,80),videoUrl:clean(body.videoUrl,1200),materials:Array.isArray(body.materials)?body.materials.slice(0,20):[],createdAt:new Date(),updatedAt:new Date()};const r=await lessons.insertOne(doc);return json(res,201,{ok:true,lesson:mapLesson({...doc,_id:r.insertedId})})}
   return json(res,400,{ok:false,error:"type must be phase or lesson"});
  }
  if(req.method==="PUT"){
   const type=req.body?.type,id=oid(req.query?.id);if(!id)return json(res,400,{ok:false,error:"Valid id is required"});
   const collection=type==="lesson"?lessons:phases;const update={updatedAt:new Date()};for(const k of ["title","description","duration","videoUrl"])if(req.body?.[k]!==undefined)update[k]=clean(req.body[k],k==="description"?3000:1200);if(req.body?.order!==undefined)update.order=Math.max(1,Number(req.body.order)||1);if(req.body?.status!==undefined&&["draft","published"].includes(req.body.status))update.status=req.body.status;if(type==="lesson"&&Array.isArray(req.body.materials))update.materials=req.body.materials.slice(0,20);
   const r=await collection.findOneAndUpdate({_id:id,courseId},{$set:update},{returnDocument:"after"});if(!r)return json(res,404,{ok:false,error:"Content not found"});return json(res,200,{ok:true,[type]:type==="lesson"?mapLesson(r):mapPhase(r)});
  }
  if(req.method==="DELETE"){const type=req.query?.type==="lesson"?"lesson":"phase",id=oid(req.query?.id);if(!id)return json(res,400,{ok:false,error:"Valid id is required"});if(type==="phase"){await lessons.deleteMany({courseId,phaseId:id});const r=await phases.deleteOne({_id:id,courseId});return json(res,200,{ok:true,deleted:r.deletedCount})}const r=await lessons.deleteOne({_id:id,courseId});return json(res,200,{ok:true,deleted:r.deletedCount})}
  return json(res,405,{ok:false,error:"Method not allowed"});
 }catch(e){console.error("Course content API error:",e);return json(res,500,{ok:false,error:"Server configuration or database error"})}
}