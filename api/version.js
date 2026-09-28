const version="2.3.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Dynamic course management foundation",runtime:"nodejs"});}
