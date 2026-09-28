const CWU_SESSION_KEY="cwu_demo_session";
async function getCurrentUser(){const r=await fetch("/api/auth/me",{credentials:"same-origin"});if(!r.ok)return null;const d=await r.json();return d.user||null;}
async function getEnrollments(){const r=await fetch("/api/student/enrollments",{credentials:"same-origin"});if(!r.ok)throw new Error("Unable to load enrollments");return r.json();}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
document.addEventListener("DOMContentLoaded",async()=>{
 const grid=document.querySelector("[data-my-courses]"),user=document.querySelector("[data-course-user]"),empty=document.querySelector("[data-empty-courses]");
 try{
  const session=await getCurrentUser();if(!session){localStorage.removeItem(CWU_SESSION_KEY);location.href="login.html";return;}
  localStorage.setItem(CWU_SESSION_KEY,JSON.stringify(session));if(user)user.textContent="Learning account: "+session.email;
  const result=await getEnrollments(),courses=result.enrollments||[],total=document.querySelector("[data-course-total]"),average=document.querySelector("[data-course-average]");
  if(total)total.textContent=courses.length;
  if(average)average.textContent=courses.length?Math.round(courses.reduce((sum,c)=>sum+(Number(c.progress)||0),0)/courses.length)+"%":"0%";
  if(!grid)return;if(!courses.length){if(empty)empty.hidden=false;return;}
  courses.forEach(course=>{
   const card=document.createElement("article");card.className="course-card my-course-card";
   const progress=Math.max(0,Math.min(100,Number(course.progress)||0)),complete=progress>=100;
   const title=escapeHtml(course.courseTitle),id=encodeURIComponent(course.courseId);
   card.innerHTML='<div class="course-card-top"><span class="icon">'+progress+'%</span><span class="course-level">'+(complete?"Completed":"In Progress")+'</span></div><h3>'+title+'</h3><p>'+(complete?"You completed this learning path. Review the quiz result or certificate.":"Continue your enrolled CWU learning path and track your progress.")+'</p><div class="progress-track"><span style="width:'+progress+'%"></span></div><div class="course-progress-row"><b>'+progress+'% complete</b><span>Server saved</span></div><div class="course-card-actions"><a class="btn btn-small" href="course-learning.html?course='+id+'">'+(complete?"Review Course →":"Continue Learning →")+'</a>'+(complete?'<a class="btn btn-small btn-outline" href="certificates.html">Certificate →</a>':"")+'</div>';
   grid.appendChild(card);
  });
 }catch(error){console.error("My Courses error:",error);if(empty){empty.hidden=false;empty.querySelector("p").textContent="Unable to load your courses right now. Please try again.";}}
});