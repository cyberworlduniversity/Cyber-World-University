const version="2.1.3";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Version update",runtime:"nodejs"});}
