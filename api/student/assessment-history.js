import { ObjectId } from "mongodb";
import { getDatabase } from "../_lib/db.js";
const json=(r,s,b)=>r.status(s).json(b);
function tokenFromCookie(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)cwu_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function currentUser(req){const t=tokenFromCookie(req);if(!t)return null;const db=await getDatabase();const s=await db.collection("sessions").findOne({token:t});return s?db.collection("users").findOne({_id:s.userId}):null}
function validIds(values){return [...new Set(values.filter(Boolean).map(String))].filter(ObjectId.isValid).map(id=>new ObjectId(id))}
export default async function handler(req,res){
 if(req.method!=="GET")return json(res,405,{ok:false,error:"Method not allowed"});
 try{
  const user=await currentUser(req);if(!user)return json(res,401,{ok:false,error:"Not authenticated"});
  const db=await getDatabase();
  const [quizzes,exams]=await Promise.all([
   db.collection("quiz_results").find({userId:user._id}).sort({submittedAt:-1}).limit(50).toArray(),
   db.collection("exam_results").find({userId:user._id}).sort({submittedAt:-1}).limit(50).toArray()
  ]);
  const quizIds=validIds(quizzes.map(x=>x.quizId)),examIds=validIds(exams.map(x=>x.examId)),courseIds=validIds([...quizzes,...exams].map(x=>x.courseId));
  const [quizDocs,examDocs,courses]=await Promise.all([
   quizIds.length?db.collection("quizzes").find({_id:{$in:quizIds}}).project({title:1,passPercent:1}).toArray():[],
   examIds.length?db.collection("exams").find({_id:{$in:examIds}}).project({title:1,passPercent:1}).toArray():[],
   courseIds.length?db.collection("courses").find({_id:{$in:courseIds}}).project({title:1}).toArray():[]
  ]);
  const quizMap=new Map(quizDocs.map(x=>[x._id.toString(),x])),examMap=new Map(examDocs.map(x=>[x._id.toString(),x])),courseMap=new Map(courses.map(x=>[x._id.toString(),x.title]));
  const history=[
   ...quizzes.map(x=>{const q=quizMap.get(String(x.quizId));return {type:"Quiz",id:x._id.toString(),assessmentId:String(x.quizId),title:q?.title||"Quiz",courseTitle:courseMap.get(String(x.courseId))||"Course",score:Number(x.score)||0,total:Number(x.total)||0,percent:Number(x.percent)||0,passed:x.passed===true,passPercent:Number(q?.passPercent)||60,submittedAt:x.submittedAt||null}}),
   ...exams.map(x=>{const e=examMap.get(String(x.examId));return {type:"Final Exam",id:x._id.toString(),assessmentId:String(x.examId),title:e?.title||"Final Exam",courseTitle:courseMap.get(String(x.courseId))||"Course",score:Number(x.score)||0,total:Number(x.total)||0,percent:Number(x.percent)||0,passed:x.passed===true,passPercent:Number(e?.passPercent)||60,submittedAt:x.submittedAt||null}})
  ].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));
  return json(res,200,{ok:true,history});
 }catch(error){console.error("Assessment history API error:",error);return json(res,500,{ok:false,error:"Server configuration or database error"})}
}
