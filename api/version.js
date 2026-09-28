const version="2.5.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Dynamic student course learning integration",runtime:"nodejs"});}
