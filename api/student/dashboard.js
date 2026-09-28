import { getDatabase } from "../_lib/db.js";
const json=(r,s,b)=>r.status(s).json(b);
function tokenFromCookie(req){const m=(req.headers.cookie||"").match(/(?:^|;\s*)cwu_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
async function currentUser(req){const t=tokenFromCookie(req);if(!t)return null;const db=await getDatabase();const s=await db.collection("sessions").findOne({token:t});return s?db.collection("users").findOne({_id:s.userId}):null}
export default async function handler(req,res){
 if(req.method!=="GET")return json(res,405,{ok:false,error:"Method not allowed"});
 try{
  const user=await currentUser(req);if(!user)return json(res,401,{ok:false,error:"Not authenticated"});
  const db=await getDatabase();
  const [enrollments,progress,quizResults,examResults,certificates]=await Promise.all([
   db.collection("enrollments").find({userId:user._id}).sort({updatedAt:-1}).toArray(),
   db.collection("course_progress").find({userId:user._id}).toArray(),
   db.collection("quiz_results").find({userId:user._id}).sort({submittedAt:-1}).limit(10).toArray(),
   db.collection("exam_results").find({userId:user._id}).sort({submittedAt:-1}).limit(10).toArray(),
   db.collection("certificates").find({userId:user._id}).sort({issuedAt:-1}).toArray()
  ]);
  const ids=[...new Set(enrollments.map(x=>String(x.courseId)).concat(quizResults.map(x=>String(x.courseId)),examResults.map(x=>String(x.courseId))))];
  const objectIds=[];const {ObjectId}=await import("mongodb");for(const id of ids)if(ObjectId.isValid(id))objectIds.push(new ObjectId(id));
  const courses=objectIds.length?await db.collection("courses").find({_id:{$in:objectIds}}).project({title:1}).toArray():[];
  const titleMap=new Map(courses.map(c=>[c._id.toString(),c.title]));
  const completedLessons=progress.reduce((sum,item)=>sum+Math.max(0,Number(item.currentLesson||0)),0);
  const averageQuizScore=quizResults.length?Math.round(quizResults.reduce((sum,item)=>sum+Number(item.percent||0),0)/quizResults.length):0;
  const averageExamScore=examResults.length?Math.round(examResults.reduce((sum,item)=>sum+Number(item.percent||0),0)/examResults.length):0;
  const current=enrollments[0]||null;
  const currentProgress=current?Number(progress.find(item=>String(item.courseId)===String(current.courseId))?.progress??current.progress??0):0;
  const recent=[...quizResults.map(x=>({type:"Quiz",title:titleMap.get(String(x.courseId))||"Course Quiz",courseId:String(x.courseId),percent:Number(x.percent||0),passed:Number(x.percent||0)>=60,submittedAt:x.submittedAt})),...examResults.map(x=>({type:"Final Exam",title:titleMap.get(String(x.courseId))||"Final Exam",courseId:String(x.courseId),percent:Number(x.percent||0),passed:Boolean(x.passed),submittedAt:x.submittedAt}))].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt)).slice(0,6);
  return json(res,200,{ok:true,stats:{
   enrolledCourses:enrollments.length,completedLessons,averageQuizScore,averageExamScore,passedExams:examResults.filter(x=>x.passed===true).length,certificates:certificates.length,
   currentCourse:current?{courseId:String(current.courseId),courseTitle:titleMap.get(String(current.courseId))||current.courseTitle||"Current Course",progress:currentProgress}:null,
   recentAssessments:recent
  }});
 }catch(error){console.error("Dashboard stats API error:",error);return json(res,500,{ok:false,error:"Server configuration or database error"})}
}