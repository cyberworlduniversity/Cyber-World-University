import { ObjectId } from "mongodb";
import { getDatabase } from "./_lib/db.js";
function json(response,status,body){response.status(status).json(body)}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null}
async function currentUser(request){const token=tokenFromCookie(request);if(!token)return null;const db=await getDatabase();const session=await db.collection("sessions").findOne({token});if(!session)return null;return db.collection("users").findOne({_id:session.userId})}
function clean(value,max=5000){return typeof value==="string"?value.trim().slice(0,max):""}
function mapCourse(c){return {id:c._id.toString(),title:c.title,description:c.description,category:c.category,level:c.level,instructor:c.instructor,duration:c.duration,thumbnail:c.thumbnail,objectives:c.objectives||[],requirements:c.requirements||[],price:c.price??0,isFree:c.isFree!==false,status:c.status||"draft",createdAt:c.createdAt,updatedAt:c.updatedAt}}
export default async function handler(request,response){
 try{
  const db=await getDatabase(),courses=db.collection("courses");
  if(request.method==="GET"){
   const all=request.query?.admin==="true";
   if(all){const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});if(user.role!=="admin")return json(response,403,{ok:false,error:"Administrator access required"})}
   const query=all?{}:{status:"published"}; const requestedId=String(request.query?.id||"").trim(); if(requestedId&&ObjectId.isValid(requestedId))query._id=new ObjectId(requestedId);
   const items=await courses.find(query).sort({createdAt:-1}).toArray();
   return json(response,200,{ok:true,courses:items.map(mapCourse)});
  }
  const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});if(user.role!=="admin")return json(response,403,{ok:false,error:"Administrator access required"});
  if(request.method==="POST"){
   const body=request.body||{},title=clean(body.title,160);
   if(!title)return json(response,400,{ok:false,error:"Course title is required"});
   const now=new Date(),doc={title,description:clean(body.description,5000),category:clean(body.category,120),level:clean(body.level,60)||"Beginner",instructor:clean(body.instructor,160),duration:clean(body.duration,80),thumbnail:clean(body.thumbnail,1000),objectives:Array.isArray(body.objectives)?body.objectives.map(x=>clean(x,300)).filter(Boolean).slice(0,30):[],requirements:Array.isArray(body.requirements)?body.requirements.map(x=>clean(x,300)).filter(Boolean).slice(0,30):[],price:Math.max(0,Number(body.price)||0),isFree:body.isFree!==false,status:["draft","published","archived"].includes(body.status)?body.status:"draft",createdAt:now,updatedAt:now};
   const result=await courses.insertOne(doc);return json(response,201,{ok:true,course:mapCourse({...doc,_id:result.insertedId})});
  }
  if(request.method==="PUT"){
   const id=String(request.query?.id||"");if(!ObjectId.isValid(id))return json(response,400,{ok:false,error:"Valid course id is required"});
   const body=request.body||{},update={updatedAt:new Date()};
   for(const key of ["title","description","category","level","instructor","duration","thumbnail"])if(body[key]!==undefined)update[key]=clean(body[key],key==="description"?5000:1000);
   if(body.objectives!==undefined)update.objectives=Array.isArray(body.objectives)?body.objectives.map(x=>clean(x,300)).filter(Boolean).slice(0,30):[];
   if(body.requirements!==undefined)update.requirements=Array.isArray(body.requirements)?body.requirements.map(x=>clean(x,300)).filter(Boolean).slice(0,30):[];
   if(body.price!==undefined)update.price=Math.max(0,Number(body.price)||0);
   if(body.isFree!==undefined)update.isFree=body.isFree!==false;
   if(body.status!==undefined&&["draft","published","archived"].includes(body.status))update.status=body.status;
   const result=await courses.findOneAndUpdate({_id:new ObjectId(id)},{$set:update},{returnDocument:"after"});
   if(!result)return json(response,404,{ok:false,error:"Course not found"});
   return json(response,200,{ok:true,course:mapCourse(result)});
  }
  if(request.method==="DELETE"){
   const id=String(request.query?.id||"");if(!ObjectId.isValid(id))return json(response,400,{ok:false,error:"Valid course id is required"});
   const result=await courses.deleteOne({_id:new ObjectId(id)});if(!result.deletedCount)return json(response,404,{ok:false,error:"Course not found"});
   return json(response,200,{ok:true});
  }
  return json(response,405,{ok:false,error:"Method not allowed"});
 }catch(error){console.error("Courses API error:",error);return json(response,500,{ok:false,error:"Server configuration or database error"})}
}