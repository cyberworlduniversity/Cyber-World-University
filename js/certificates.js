document.addEventListener("DOMContentLoaded",async()=>{
 const wrap=document.querySelector("[data-certificate-wrap]"),empty=document.querySelector("[data-certificate-empty]");
 try{
  const me=await fetch("/api/auth/me",{credentials:"include"});if(!me.ok)throw new Error("login");
  const user=await me.json();document.querySelector("[data-certificate-user]").textContent="Certificate account: "+(user.email||"");
  let response=await fetch("/api/student/certificate?courseId=ethical-hacking-fundamentals",{credentials:"include"});if(!response.ok)throw new Error("certificate");
  let data=await response.json();
  if(data.eligible&&!data.certificate){
   const issued=await fetch("/api/student/certificate",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({courseId:"ethical-hacking-fundamentals"})});
   if(issued.ok)data=await issued.json();
  }
  if(!data.certificate){empty.hidden=false;return}
  const c=data.certificate;document.querySelector("[data-certificate-name]").textContent=user.name||"CWU Student";
  document.querySelector("[data-certificate-course]").textContent=c.courseTitle;
  document.querySelector("[data-certificate-date]").textContent=new Date(c.issuedAt).toLocaleDateString();
  document.querySelector("[data-certificate-id]").textContent=c.certificateId;wrap.hidden=false;
  document.querySelector("[data-print]").addEventListener("click",()=>window.print());
 }catch(error){empty.hidden=false;if(error.message==="login")empty.querySelector("p").textContent="Please log in to view your certificate status.";}
});