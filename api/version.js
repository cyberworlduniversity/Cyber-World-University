const version="2.4.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Course phases and lessons management",runtime:"nodejs"});}
