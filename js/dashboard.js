const CWU_SESSION_KEY="cwu_demo_session";

async function getCurrentUser(){
 const response=await fetch("/api/auth/me",{credentials:"same-origin"});
 if(!response.ok)return null; const data=await response.json(); return data.user||null;
}
async function loadDashboardStats(){
 const response=await fetch("/api/student/dashboard",{credentials:"same-origin"});
 if(!response.ok)throw new Error("stats");
 return response.json();
}
document.addEventListener("DOMContentLoaded",async()=>{
 const nameEl=document.querySelector("[data-student-name]"),emailEl=document.querySelector("[data-student-email]");
 const logout=document.querySelector("[data-logout]"),guest=document.querySelector("[data-dashboard-guest]"),content=document.querySelector("[data-dashboard-content]");
 try{
  const user=await getCurrentUser();
  if(!user){localStorage.removeItem(CWU_SESSION_KEY);content.hidden=true;guest.hidden=false;guest.innerHTML='<p class="eyebrow">LOGIN REQUIRED</p><h2>Please log in to view your dashboard</h2><p>Your secure student session is not active.</p><a class="btn" href="login.html">Go to Login →</a>';return;}
  localStorage.setItem(CWU_SESSION_KEY,JSON.stringify(user));nameEl.textContent=user.name||"Student";emailEl.textContent=user.email||"";
  const data=await loadDashboardStats(),s=data.stats||{};
  document.querySelector("[data-stat-enrolled]").textContent=s.enrolledCourses??0;
  document.querySelector("[data-stat-lessons]").textContent=s.completedLessons??0;
  document.querySelector("[data-stat-quiz]").textContent=(s.averageQuizScore??0)+"%";
  document.querySelector("[data-stat-certificates]").textContent=s.certificates??0;
  const course=s.currentCourse, title=document.querySelector("[data-current-course]"),copy=document.querySelector("[data-current-course-copy]"),bar=document.querySelector("[data-current-progress]"),label=document.querySelector("[data-current-progress-label]"),link=document.querySelector("[data-current-course-link]");
  if(course){const p=Math.max(0,Math.min(100,Number(course.progress||0)));title.textContent=course.courseTitle;copy.textContent=p>=100?"Course completed. Review your results or certificate.":"Continue your learning path and complete the next lesson.";bar.style.width=p+"%";label.textContent=p+"% complete";link.href="course-learning.html";}
  if(logout)logout.addEventListener("click",async()=>{logout.disabled=true;try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"});}finally{localStorage.removeItem(CWU_SESSION_KEY);location.href="index.html";}});
 }catch(error){console.error("Dashboard error:",error);content.hidden=true;guest.hidden=false;guest.innerHTML='<p class="eyebrow">DASHBOARD ERROR</p><h2>Unable to load your dashboard</h2><p>Please try again after signing in.</p><a class="btn" href="login.html">Login Again →</a>';}
});