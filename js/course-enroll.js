document.addEventListener("DOMContentLoaded",()=>{
  const button=document.querySelector("[data-enroll]");
  const message=document.querySelector("[data-enroll-message]");
  if(!button)return;

  const show=(text,type="info")=>{
    if(message){message.hidden=false;message.className="form-message "+type;message.textContent=text;}
  };

  button.addEventListener("click",async()=>{
    button.disabled=true;
    try{
      const session=await fetch("/api/auth/me",{credentials:"same-origin"});
      if(!session.ok){location.href="login.html";return;}

      const response=await fetch("/api/student/enrollments",{
        method:"POST",
        credentials:"same-origin",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          courseId:"ethical-hacking-fundamentals",
          courseTitle:"Ethical Hacking Fundamentals"
        })
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Unable to enroll");

      show(data.message||"Enrollment successful.","success");
      button.textContent="Enrolled ✓";
    }catch(error){
      show(error.message,"error");
      button.disabled=false;
    }
  });
});
