import { getDatabase } from "../../_lib/db.js";

function json(response,status,body){response.status(status).json(body);}

function tokenFromCookie(request){
  const cookie=request.headers.cookie||"";
  const match=cookie.match(/(?:^|;\\s*)cwu_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function currentUser(request){
  const token=tokenFromCookie(request);
  if(!token)return null;
  const db=await getDatabase();
  const session=await db.collection("sessions").findOne({token});
  if(!session)return null;
  return db.collection("users").findOne({_id:session.userId});
}

export default async function handler(request,response){
  if(!["GET","PATCH"].includes(request.method))return json(response,405,{ok:false,error:"Method not allowed"});
  try{
    const user=await currentUser(request);
    if(!user)return json(response,401,{ok:false,error:"Not authenticated"});
    const db=await getDatabase();
    const users=db.collection("users");

    if(request.method==="PATCH"){
      const {name}=request.body||{};
      if(typeof name!=="string"||name.trim().length<2)return json(response,400,{ok:false,error:"A valid name is required"});
      await users.updateOne({_id:user._id},{$set:{name:name.trim(),updatedAt:new Date()}});
      user.name=name.trim();
    }

    return json(response,200,{ok:true,user:{
      id:user._id.toString(),
      name:user.name,
      email:user.email,
      role:user.role
    }});
  }catch(error){
    console.error("Profile API error:",error);
    return json(response,500,{ok:false,error:"Server configuration or database error"});
  }
}
