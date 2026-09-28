async function adminLoginRequest(payload){
  const response=await fetch("/api/auth/admin-login",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(payload)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||"Admin login failed");
  return data;
}
document.addEventListener("DOMContentLoaded",()=>{
  const form=document.querySelector("[data-admin-login-form]");
  const message=document.querySelector("[data-admin-login-message]");
  form?.addEventListener("submit",async event=>{
    event.preventDefault();
    message.hidden=true;
    const data=new FormData(form);
    try{
      const result=await adminLoginRequest({
        username:String(data.get("username")||"").trim(),
        password:String(data.get("password")||"")
      });
      localStorage.setItem("cwu_demo_session",JSON.stringify(result.user));
      location.href="admin.html";
    }catch(error){
      message.hidden=false;
      message.className="form-message error";
      message.textContent=error.message;
    }
  });
});