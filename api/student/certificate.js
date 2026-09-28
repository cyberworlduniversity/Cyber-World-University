import { getDatabase } from "../_lib/db.js";

function json(response,status,body){response.status(status).json(body);}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null;}
async function currentUser(request){const token=tokenFromCookie(request);if(!token)return null;const db=await getDatabase();const session=await db.collection("sessions").findOne({token});if(!session)return null;return db.collection("users").findOne({_id:session.userId});}
export default async function handler(request,response){
 if(!["GET","POST"].includes(request.method))return json(response,405,{ok:false,error:"Method not allowed"});
 try{
  const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
  const courseId=String(request.query?.courseId||request.body?.courseId||"").trim();
  const db=await getDatabase();
  const progress=await db.collection("course_progress").findOne({userId:user._id,courseId});
  const course=courseId&&/^[a-f0-9]{24}$/i.test(courseId)?await db.collection("courses").findOne({_id:new (await import("mongodb")).ObjectId(courseId)}):null;
  const latestQuiz=await db.collection("quiz_results").find({userId:user._id,courseId}).sort({submittedAt:-1}).limit(1).toArray();
  const latestExam=await db.collection("exam_results").find({userId:user._id,courseId}).sort({submittedAt:-1}).limit(1).toArray();
  const quiz=latestQuiz[0]||null,exam=latestExam[0]||null, progressPercent=Number(progress?.percent||0), quizPercent=Number(quiz?.percent||0), examPercent=Number(exam?.percent||0);
  const eligible=progressPercent>=100&&quizPercent>=60&&(!courseId||exam!==null);
  const certificates=db.collection("certificates"); let certificate=await certificates.findOne({userId:user._id,courseId});
  if(request.method==="POST"){
   if(!eligible)return json(response,403,{ok:false,eligible:false,error:"Complete the course and pass the quiz with at least 60% to receive a certificate."});
   if(!certificate){
    const now=new Date(),prefix=String(user.name||"STUDENT").replace(/[^a-z0-9]/gi,"").toUpperCase().slice(0,6)||"STUDENT";
    const certificateId="CWU-"+now.getUTCFullYear()+"-"+prefix+"-"+Math.random().toString(36).slice(2,8).toUpperCase();
    const doc={userId:user._id,courseId,courseTitle:course?.title||"Cyber World University Course",certificateId,issuedAt:now};
    const inserted=await certificates.insertOne(doc);certificate={_id:inserted.insertedId,...doc};
   }
  }
  return json(response,200,{ok:true,eligible,requirements:{courseCompleted:progressPercent>=100,quizPassed:quizPercent>=60,examPassed:exam?Boolean(exam.passed):false,progressPercent,quizPercent,examPercent},certificate:certificate?{id:certificate._id.toString(),certificateId:certificate.certificateId,courseId:certificate.courseId,courseTitle:certificate.courseTitle,issuedAt:certificate.issuedAt}:null});
 }catch(error){console.error("Certificates API error:",error);return json(response,500,{ok:false,error:"Server configuration or database error"});}
}