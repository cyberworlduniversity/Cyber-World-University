import { getDatabase } from "../_lib/db.js";

function json(response,status,body){response.status(status).json(body);}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null;}
async function currentUser(request){const token=tokenFromCookie(request);if(!token)return null;const db=await getDatabase();const session=await db.collection("sessions").findOne({token});if(!session)return null;return db.collection("users").findOne({_id:session.userId});}

export default async function handler(request,response){
 if(request.method!=="GET")return json(response,405,{ok:false,error:"Method not allowed"});
 try{
  const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
  const db=await getDatabase();
  const [enrollments,progress,quizResults,certificates]=await Promise.all([
   db.collection("enrollments").find({userId:user._id}).sort({updatedAt:-1}).toArray(),
   db.collection("course_progress").find({userId:user._id}).toArray(),
   db.collection("quiz_results").find({userId:user._id}).toArray(),
   db.collection("certificates").find({userId:user._id}).toArray()
  ]);
  const completedLessons=progress.reduce((sum,item)=>sum+Math.max(0,Math.min(Number(item.currentLesson||0),4)),0);
  const averageQuizScore=quizResults.length?Math.round(quizResults.reduce((sum,item)=>sum+Number(item.percent||0),0)/quizResults.length):0;
  const current=enrollments[0]||null;
  const currentProgress=current?Number(progress.find(item=>item.courseId===current.courseId)?.progress??current.progress??0):0;
  return json(response,200,{ok:true,stats:{
   enrolledCourses:enrollments.length,completedLessons,averageQuizScore,certificates:certificates.length,
   currentCourse:current?{courseId:current.courseId,courseTitle:current.courseTitle,progress:currentProgress}:null
  }});
 }catch(error){console.error("Dashboard stats API error:",error);return json(response,500,{ok:false,error:"Server configuration or database error"});}
}