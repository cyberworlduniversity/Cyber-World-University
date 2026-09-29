import { ObjectId } from "mongodb";
import { getDatabase } from "../_lib/db.js";

function json(response,status,body){response.status(status).json(body);}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null;}
async function currentUser(request){
  const token=tokenFromCookie(request);if(!token)return null;
  const db=await getDatabase();
  const session=await db.collection("sessions").findOne({token});if(!session)return null;
  return db.collection("users").findOne({_id:session.userId});
}
const oid=v=>typeof v==="string"&&ObjectId.isValid(v)?new ObjectId(v):null;

export default async function handler(request,response){
  if(request.method!=="GET")return json(response,405,{ok:false,error:"Method not allowed"});
  try{
    const user=await currentUser(request);if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
    const db=await getDatabase();
    const query={userId:user._id};
    const requestedQuiz=oid(request.query?.quizId);
    if(requestedQuiz)query.quizId=requestedQuiz;
    const items=await db.collection("quiz_results").find(query).sort({submittedAt:-1}).limit(50).toArray();
    const quizIds=[...new Set(items.map(item=>item.quizId).filter(Boolean).map(String))].filter(ObjectId.isValid).map(id=>new ObjectId(id));
    const courseIds=[...new Set(items.map(item=>item.courseId).filter(Boolean).map(String))].filter(ObjectId.isValid).map(id=>new ObjectId(id));
    const [quizzes,courses]=await Promise.all([
      quizIds.length?db.collection("quizzes").find({_id:{$in:quizIds}}).toArray():[],
      courseIds.length?db.collection("courses").find({_id:{$in:courseIds}}).toArray():[]
    ]);
    const quizMap=new Map(quizzes.map(q=>[q._id.toString(),q]));
    const courseMap=new Map(courses.map(c=>[c._id.toString(),c]));
    const results=items.map(item=>{
      const quiz=quizMap.get(String(item.quizId));
      const course=courseMap.get(String(item.courseId));
      return {
        id:item._id.toString(),
        courseId:String(item.courseId),
        courseTitle:course?.title||"Course",
        quizId:String(item.quizId),
        quizTitle:quiz?.title||"Quiz",
        score:Number(item.score)||0,
        total:Number(item.total)||0,
        percent:Number(item.percent)||0,
        passed:item.passed===true,
        passPercent:Number(quiz?.passPercent)||60,
        submittedAt:item.submittedAt||null
      };
    });
    return json(response,200,{ok:true,results});
  }catch(error){
    console.error("Quiz results API error:",error);
    return json(response,500,{ok:false,error:"Server configuration or database error"});
  }
}
