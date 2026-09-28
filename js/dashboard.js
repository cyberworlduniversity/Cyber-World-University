const CWU_SESSION_KEY="cwu_demo_session";

document.addEventListener("DOMContentLoaded",()=>{
  const session = getSession();
  const nameEl = document.querySelector("[data-student-name]");
  const emailEl = document.querySelector("[data-student-email]");
  const logout = document.querySelector("[data-logout]");
  const guest = document.querySelector("[data-dashboard-guest]");
  const content = document.querySelector("[data-dashboard-content]");

  if(!session){
    if(content) content.hidden=true;
    if(guest){
      guest.hidden=false;
      guest.innerHTML='<h2>Please log in to view your dashboard</h2><p>Your demo student session is not active.</p><a class="btn" href="login.html">Go to Login</a>';
    }
    return;
  }

  if(nameEl) nameEl.textContent=session.name||"Student";
  if(emailEl) emailEl.textContent=session.email||"";
  if(logout) logout.addEventListener("click",()=>{
    localStorage.removeItem(CWU_SESSION_KEY);
    location.href="index.html";
  });
});

function getSession(){
  try{return JSON.parse(localStorage.getItem(CWU_SESSION_KEY)||"null")}catch{return null}
}