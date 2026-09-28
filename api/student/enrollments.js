import { getDatabase } from "../_lib/db.js";

function json(response,status,body){response.status(status).json(body);}
function tokenFromCookie(request){const cookie=request.headers.cookie||"";const match=cookie.match(/(?:^|;\s*)cwu_session=([^;]+)/);return match?decodeURIComponent(match[1]):null;}

async function currentUser(request){
  const token=tokenFromCookie(request); if(!token)return null;
  const db=await getDatabase();
  const session=await db.collection("sessions").findOne({token}); if(!session)return null;
  return db.collection("users").findOne({_id:session.userId});
}

export default async function handler(request,response){
  if(!["GET","POST"].includes(request.method))return json(response,405,{ok:false,error:"Method not allowed"});
  try{
    const user=await currentUser(request); if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
    const db=await getDatabase(); const enrollments=db.collection("enrollments");

    if(request.method==="POST"){
      const {courseId,courseTitle}=request.body||{};
      if(typeof courseId!=="string"||typeof courseTitle!=="string"||!courseId.trim()||!courseTitle.trim())
        return json(response,400,{ok:false,error:"Course details are required"});
      const existing=await enrollments.findOne({userId:user._id,courseId:courseId.trim()});
      if(existing)return json(response,200,{ok:true,enrollment:existing,message:"Already enrolled"});
      const enrollment={userId:user._id,courseId:courseId.trim(),courseTitle:courseTitle.trim(),progress:0,enrolledAt:new Date(),updatedAt:new Date()};
      const result=await enrollments.insertOne(enrollment); enrollment._id=result.insertedId;
      return json(response,201,{ok:true,enrollment,message:"Enrollment successful"});
    }

    const courseId=typeof request.query?.courseId==="string"?request.query.courseId.trim():"";
    const query={userId:user._id};
    if(courseId)query.courseId=courseId;
    const items=await enrollments.find(query).sort({enrolledAt:-1}).toArray();
    return json(response,200,{ok:true,enrolled:courseId?items.length>0:undefined,enrollments:items.map(item=>({
      id:item._id.toString(),courseId:item.courseId,courseTitle:item.courseTitle,progress:item.progress||0,enrolledAt:item.enrolledAt
    }))});
  }catch(error){
    console.error("Enrollment API error:",error);
    return json(response,500,{ok:false,error:"Server configuration or database error"});
  }
}
