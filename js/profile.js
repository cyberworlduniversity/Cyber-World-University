document.addEventListener("DOMContentLoaded",async()=>{
  const form=document.querySelector("[data-profile-form]");
  const message=document.querySelector("[data-profile-message]");
  if(!form)return;

  const show=(text,type="info")=>{
    if(message){message.hidden=false;message.className="form-message "+type;message.textContent=text;}
  };

  try{
    const response=await fetch("/api/student/profile",{credentials:"same-origin"});
    if(!response.ok){location.href="login.html";return;}
    const data=await response.json();
    form.elements.name.value=data.user.name||"";
    form.elements.email.value=data.user.email||"";
    form.elements.role.value=data.user.role||"student";

    form.addEventListener("submit",async event=>{
      event.preventDefault();
      try{
        const update=await fetch("/api/student/profile",{
          method:"PATCH",
          credentials:"same-origin",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({name:form.elements.name.value.trim()})
        });
        const result=await update.json();
        if(!update.ok)throw new Error(result.error||"Unable to update profile");
        show("Profile updated successfully.","success");
      }catch(error){show(error.message,"error");}
    });
  }catch(error){
    console.error("Profile error:",error);
    show("Unable to load your profile.","error");
  }
});
