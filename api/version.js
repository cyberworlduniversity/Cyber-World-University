const version="1.8.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Dynamic student dashboard statistics",runtime:"nodejs"});}
