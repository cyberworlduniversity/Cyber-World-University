const version="2.2.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Protected admin dashboard foundation",runtime:"nodejs"});}
