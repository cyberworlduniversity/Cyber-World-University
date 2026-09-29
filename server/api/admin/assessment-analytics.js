import { getDatabase } from "../_lib/db.js";
function json(response,status,body){response.status(status).json(body)}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null}
async function currentUser(request){const token=tokenFromCookie(request);if(!token)return null;const db=await getDatabase();const session=await db.collection("sessions").findOne({token});return session?db.collection("users").findOne({_id:session.userId}):null}
export default async function handler(request,response){
 if(request.method!=="GET")return json(response,405,{ok:false,error:"Method not allowed"});
 try{
  const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});if(user.role!=="admin")return json(response,403,{ok:false,error:"Administrator access required"});
  const db=await getDatabase();
  const [quiz,exam]=await Promise.all([
   db.collection("quiz_results").find({}).sort({submittedAt:-1}).limit(100).toArray(),
   db.collection("exam_results").find({}).sort({submittedAt:-1}).limit(100).toArray()
  ]);
  const all=[...quiz.map(x=>({...x,type:"Quiz"})),...exam.map(x=>({...x,type:"Final Exam"}))].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt));
  const summary=items=>{
   const attempted=items.length;
   const passed=items.filter(x=>x.passed===true).length;
   const average=attempted?Math.round(items.reduce((s,x)=>s+Number(x.percent||0),0)/attempted):0;
   return {attempted,passed,failed:attempted-passed,passRate:attempted?Math.round(passed/attempted*100):0,averageScore:average};
  };
  const byCourse=new Map();
  for(const item of all){
   const key=String(item.courseId||"unknown");
   if(!byCourse.has(key))byCourse.set(key,{courseId:key,attempts:0,passed:0,totalPercent:0});
   const row=byCourse.get(key);row.attempts++;row.passed+=item.passed===true?1:0;row.totalPercent+=Number(item.percent||0);
  }
  const courseIds=[...byCourse.keys()].filter(id=>/^[a-f\d]{24}$/i.test(id));
  const {ObjectId}=await import("mongodb");
  const courses=courseIds.length?await db.collection("courses").find({_id:{$in:courseIds.map(id=>new ObjectId(id))}}).project({title:1}).toArray():[];
  const titleMap=new Map(courses.map(c=>[c._id.toString(),c.title]));
  const coursePerformance=[...byCourse.values()].map(x=>({courseId:x.courseId,courseTitle:titleMap.get(x.courseId)||"Course",attempts:x.attempts,passed:x.passed,passRate:Math.round(x.passed/x.attempts*100),averageScore:Math.round(x.totalPercent/x.attempts)})).sort((a,b)=>b.attempts-a.attempts).slice(0,10);
  return json(response,200,{ok:true,analytics:{quiz:summary(quiz),finalExam:summary(exam),overall:summary(all),recent:all.slice(0,12).map(x=>({type:x.type,courseId:String(x.courseId||""),score:Number(x.score)||0,total:Number(x.total)||0,percent:Number(x.percent)||0,passed:x.passed===true,submittedAt:x.submittedAt||null})),coursePerformance}});
 }catch(error){console.error("Admin assessment analytics error:",error);return json(response,500,{ok:false,error:"Server configuration or database error"})}
}
