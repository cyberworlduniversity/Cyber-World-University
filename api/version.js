const version="3.1.0";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Professional Vercel security and Node.js runtime",runtime:"nodejs24"});}
