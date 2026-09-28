import { getDatabase } from "../_lib/db.js";

function json(response,status,body){response.status(status).json(body);}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null;}

async function currentUser(request){
  const token=tokenFromCookie(request); if(!token)return null;
  const db=await getDatabase();
  const session=await db.collection("sessions").findOne({token}); if(!session)return null;
  return db.collection("users").findOne({_id:session.userId});
}

export default async function handler(request,response){
  if(!["GET","PATCH"].includes(request.method))return json(response,405,{ok:false,error:"Method not allowed"});
  try{
    const user=await currentUser(request); if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
    const db=await getDatabase();
    const progress=db.collection("course_progress");

    if(request.method==="PATCH"){
      const {courseId,lesson}=request.body||{};
      const lessonNumber=Number(lesson);
      if(typeof courseId!=="string"||!courseId.trim()||!Number.isInteger(lessonNumber)||lessonNumber<1)
        return json(response,400,{ok:false,error:"Valid courseId and lesson are required"});

      const completedLesson=Math.min(lessonNumber,4);
      const percent=Math.round((completedLesson/4)*100);
      await progress.updateOne(
        {userId:user._id,courseId:courseId.trim()},
        {$set:{currentLesson:completedLesson,progress:percent,updatedAt:new Date()},$setOnInsert:{userId:user._id,courseId:courseId.trim(),createdAt:new Date()}},
        {upsert:true}
      );
      await db.collection("enrollments").updateOne(
        {userId:user._id,courseId:courseId.trim()},
        {$set:{progress:percent,updatedAt:new Date()}}
      );
      return json(response,200,{ok:true,courseId:courseId.trim(),currentLesson:completedLesson,progress:percent});
    }

    const courseId=typeof request.query?.courseId==="string"?request.query.courseId.trim():"";
    const query={userId:user._id};
    if(courseId)query.courseId=courseId;
    const items=await progress.find(query).toArray();
    return json(response,200,{ok:true,progress:items.map(item=>({courseId:item.courseId,currentLesson:item.currentLesson||1,progress:item.progress||0}))});
  }catch(error){
    console.error("Progress API error:",error);
    return json(response,500,{ok:false,error:"Server configuration or database error"});
  }
}
