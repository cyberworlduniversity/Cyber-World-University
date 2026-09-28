const CWU_SESSION_KEY="cwu_demo_session";

async function getCurrentUser(){
  const response=await fetch("/api/auth/me",{credentials:"same-origin"});
  if(!response.ok) return null;
  const data=await response.json();
  return data.user||null;
}

document.addEventListener("DOMContentLoaded",async()=>{
  const nameEl=document.querySelector("[data-student-name]");
  const emailEl=document.querySelector("[data-student-email]");
  const logout=document.querySelector("[data-logout]");
  const guest=document.querySelector("[data-dashboard-guest]");
  const content=document.querySelector("[data-dashboard-content]");

  try{
    const user=await getCurrentUser();

    if(!user){
      localStorage.removeItem(CWU_SESSION_KEY);
      if(content) content.hidden=true;
      if(guest){
        guest.hidden=false;
        guest.innerHTML='<p class="eyebrow">LOGIN REQUIRED</p><h2>Please log in to view your dashboard</h2><p>Your secure student session is not active.</p><a class="btn" href="login.html">Go to Login →</a>';
      }
      return;
    }

    localStorage.setItem(CWU_SESSION_KEY,JSON.stringify(user));
    if(nameEl) nameEl.textContent=user.name||"Student";
    if(emailEl) emailEl.textContent=user.email||"";

    if(logout) logout.addEventListener("click",async()=>{
      logout.disabled=true;
      try{
        await fetch("/api/auth/logout",{
          method:"POST",
          credentials:"same-origin"
        });
      }finally{
        localStorage.removeItem(CWU_SESSION_KEY);
        location.href="index.html";
      }
    });
  }catch(error){
    console.error("Dashboard session error:",error);
    if(content) content.hidden=true;
    if(guest){
      guest.hidden=false;
      guest.innerHTML='<p class="eyebrow">SESSION ERROR</p><h2>Unable to verify your student session</h2><p>Please try logging in again.</p><a class="btn" href="login.html">Login Again →</a>';
    }
  }
});
