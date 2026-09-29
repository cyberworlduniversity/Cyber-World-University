import { ObjectId } from "mongodb";
import { getDatabase } from "../_lib/db.js";
const json=(r,s,b)=>r.status(s).json(b);
function token(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)cwu_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function currentAdmin(req){const t=token(req);if(!t)return null;const db=await getDatabase();const session=await db.collection("sessions").findOne({token:t});if(!session)return null;const user=await db.collection("users").findOne({_id:session.userId});return user?.role==="admin"?user:null}
const esc=s=>String(s).replace(/[.*+?^$\{\}()|[\]\\]/g,"\\$&");
export default async function handler(req,res){
 if(req.method!=="GET")return json(res,405,{ok:false,error:"Method not allowed"});
 try{
  if(!await currentAdmin(req))return json(res,403,{ok:false,error:"Administrator access required"});
  const db=await getDatabase(),users=db.collection("users"),id=String(req.query?.id||"").trim(),q=String(req.query?.q||"").trim();
  if(id){
   if(!ObjectId.isValid(id))return json(res,400,{ok:false,error:"Valid student id is required"});
   const user=await users.findOne({_id:new ObjectId(id),role:"student"},{projection:{passwordHash:0}});
   if(!user)return json(res,404,{ok:false,error:"Student not found"});
   const [enrollments,progress,quizzes,exams,certificates]=await Promise.all([
    db.collection("enrollments").find({userId:user._id}).sort({enrolledAt:-1}).toArray(),
    db.collection("course_progress").find({userId:user._id}).sort({updatedAt:-1}).toArray(),
    db.collection("quiz_results").find({userId:user._id}).sort({submittedAt:-1}).limit(50).toArray(),
    db.collection("exam_results").find({userId:user._id}).sort({submittedAt:-1}).limit(50).toArray(),
    db.collection("certificates").find({userId:user._id}).sort({issuedAt:-1}).limit(50).toArray()
   ]);
   return json(res,200,{ok:true,student:{id:user._id.toString(),name:user.name,email:user.email,createdAt:user.createdAt,enrollments:enrollments.map(x=>({courseId:x.courseId,courseTitle:x.courseTitle,progress:Number(x.progress||0),enrolledAt:x.enrolledAt})),progress:progress.map(x=>({courseId:x.courseId,progress:Number(x.progress||0),totalLessons:Number(x.totalLessons||0)})),quizzes:quizzes.map(x=>({courseId:x.courseId,percent:x.percent,passed:x.passed===true,submittedAt:x.submittedAt})),exams:exams.map(x=>({courseId:x.courseId,percent:x.percent,passed:x.passed===true,submittedAt:x.submittedAt})),certificates:certificates.map(x=>({certificateId:x.certificateId,courseTitle:x.courseTitle,status:x.status==="revoked"?"revoked":"active",issuedAt:x.issuedAt}))}});
  }
  const filter=q?{$and:[{role:"student"},{$or:[{name:{$regex:esc(q),$options:"i"}},{email:{$regex:esc(q),$options:"i"}}]}]}:{role:"student"};
  const rows=await users.find(filter,{projection:{passwordHash:0}}).sort({createdAt:-1}).limit(100).toArray(),ids=rows.map(x=>x._id);
  const [enrollments,progress,quizzes,exams,certificates]=await Promise.all([
   ids.length?db.collection("enrollments").find({userId:{$in:ids}}).toArray():[],
   ids.length?db.collection("course_progress").find({userId:{$in:ids}}).toArray():[],
   ids.length?db.collection("quiz_results").find({userId:{$in:ids}}).toArray():[],
   ids.length?db.collection("exam_results").find({userId:{$in:ids}}).toArray():[],
   ids.length?db.collection("certificates").find({userId:{$in:ids}}).toArray():[]
  ]);
  const count=(a,id)=>a.filter(x=>String(x.userId)===String(id)).length;
  return json(res,200,{ok:true,students:rows.map(x=>({id:x._id.toString(),name:x.name,email:x.email,createdAt:x.createdAt,enrollments:count(enrollments,x._id),completedCourses:progress.filter(p=>String(p.userId)===String(x._id)&&Number(p.progress)>=100).length,quizAttempts:count(quizzes,x._id),examAttempts:count(exams,x._id),certificates:count(certificates,x._id)}))});
 }catch(e){console.error("Admin students API error:",e);return json(res,500,{ok:false,error:"Server configuration or database error"})}
}