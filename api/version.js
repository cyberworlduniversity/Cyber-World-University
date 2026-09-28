const version="2.1.4";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Version 2.1.4",runtime:"nodejs"});}
