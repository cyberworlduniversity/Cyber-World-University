import { getDatabase } from "../_lib/db.js";

const COURSE_CATALOG={"ethical-hacking-fundamentals":{totalLessons:4}};

function json(response,status,body){response.status(status).json(body);}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null;}

async function currentUser(request){
  const token=tokenFromCookie(request);if(!token)return null;
  const db=await getDatabase();
  const session=await db.collection("sessions").findOne({token});if(!session)return null;
  return db.collection("users").findOne({_id:session.userId});
}

export default async function handler(request,response){
  if(!["GET","POST"].includes(request.method))return json(response,405,{ok:false,error:"Method not allowed"});
  try{
    const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
    const db=await getDatabase();const results=db.collection("quiz_results");

    if(request.method==="POST"){
      const {courseId,quizId,score,total}=request.body||{};
      const nScore=Number(score),nTotal=Number(total);
      const id=typeof courseId==="string"?courseId.trim():"";
      const quiz=typeof quizId==="string"?quizId.trim():"";
      if(!COURSE_CATALOG[id]||!quiz||!Number.isInteger(nScore)||!Number.isInteger(nTotal)||nTotal<1||nScore<0||nScore>nTotal)
        return json(response,400,{ok:false,error:"Valid quiz result data is required"});
      const enrollment=await db.collection("enrollments").findOne({userId:user._id,courseId:id});
      if(!enrollment)return json(response,403,{ok:false,error:"Enroll in this course before taking the quiz"});
      const progress=await db.collection("course_progress").findOne({userId:user._id,courseId:id});
      if(!progress||Number(progress.progress)!==100)return json(response,403,{ok:false,error:"Complete all course lessons before taking the quiz"});
      const safePercent=Math.round((nScore/nTotal)*100);
      const result={userId:user._id,courseId:id,quizId:quiz,score:nScore,total:nTotal,percent:safePercent,submittedAt:new Date()};
      const inserted=await results.insertOne(result);
      return json(response,201,{ok:true,resultId:inserted.insertedId.toString(),result});
    }

    const items=await results.find({userId:user._id}).sort({submittedAt:-1}).limit(20).toArray();
    return json(response,200,{ok:true,results:items.map(item=>({id:item._id.toString(),courseId:item.courseId,quizId:item.quizId,score:item.score,total:item.total,percent:item.percent,submittedAt:item.submittedAt}))});
  }catch(error){
    console.error("Quiz results API error:",error);
    return json(response,500,{ok:false,error:"Server configuration or database error"});
  }
}
