const version="2.1.1";
export default function handler(request,response){response.status(200).json({ok:true,service:"Cyber World University",version,release:"Lesson completion and progress integrity",runtime:"nodejs"});}
