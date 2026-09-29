import { ObjectId } from "mongodb";
import { randomUUID } from "node:crypto";
import { getDatabase } from "../_lib/db.js";

const json=(response,status,body)=>response.status(status).json(body);
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null}
async function currentUser(request){const token=tokenFromCookie(request);if(!token)return null;const db=await getDatabase();const session=await db.collection("sessions").findOne({token});if(!session)return null;return db.collection("users").findOne({_id:session.userId})}

export default async function handler(request,response){
 if(!["GET","POST"].includes(request.method))return json(response,405,{ok:false,error:"Method not allowed"});
 try{
  const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
  const courseId=String(request.query?.courseId||request.body?.courseId||"").trim();
  if(!ObjectId.isValid(courseId))return json(response,400,{ok:false,error:"A valid courseId is required"});
  const db=await getDatabase(),courseObjectId=new ObjectId(courseId);
  const [course,progress,quizResults,examResults]=await Promise.all([
   db.collection("courses").findOne({_id:courseObjectId}),
   db.collection("course_progress").findOne({userId:user._id,courseId}),
   db.collection("quiz_results").find({userId:user._id,courseId}).sort({submittedAt:-1}).limit(1).toArray(),
   db.collection("exam_results").find({userId:user._id,courseId}).sort({submittedAt:-1}).limit(1).toArray()
  ]);
  if(!course)return json(response,404,{ok:false,error:"Course not found"});
  const quiz=quizResults[0]||null,exam=examResults[0]||null;
  const progressPercent=Number(progress?.progress||0),quizPercent=Number(quiz?.percent||0),examPercent=Number(exam?.percent||0);
  const courseCompleted=progressPercent>=100,quizPassed=quiz?.passed===true,examPassed=exam?.passed===true;
  const eligible=courseCompleted&&quizPassed&&examPassed;
  const certificates=db.collection("certificates");
  let certificate=await certificates.findOne({userId:user._id,courseId});
  if(request.method==="POST"){
   if(!eligible)return json(response,403,{ok:false,eligible:false,error:"Complete the course, pass the quiz, and pass the final exam to receive a certificate."});
   if(!certificate){
    const now=new Date();
    const prefix=String(user.name||"STUDENT").replace(/[^a-z0-9]/gi,"").toUpperCase().slice(0,6)||"STUDENT";
    const certificateId="CWU-"+now.getUTCFullYear()+"-"+prefix+"-"+randomUUID().replaceAll("-","").slice(0,10).toUpperCase();
    const doc={userId:user._id,courseId,courseTitle:course.title||"Cyber World University Course",certificateId,issuedAt:now};
    const inserted=await certificates.insertOne(doc);certificate={_id:inserted.insertedId,...doc};
   }
  }
  return json(response,200,{ok:true,eligible,requirements:{courseCompleted,quizPassed,examPassed,progressPercent,quizPercent,examPercent},certificate:certificate?{id:certificate._id.toString(),certificateId:certificate.certificateId,courseId:certificate.courseId,courseTitle:certificate.courseTitle,issuedAt:certificate.issuedAt}:null});
 }catch(error){console.error("Certificates API error:",error);return json(response,500,{ok:false,error:"Server configuration or database error"});}
}