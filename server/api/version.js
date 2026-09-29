const version="3.13.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Protected admin login",runtime:"nodejs24"});}
