const version="3.6.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Dynamic student assessment dashboard and analytics",runtime:"nodejs24"});}
