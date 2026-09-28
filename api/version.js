const version="3.12.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Admin assessment analytics",runtime:"nodejs24"});}
