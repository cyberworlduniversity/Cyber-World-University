const CWU_SESSION_KEY="cwu_demo_session";

async function getCurrentUser(){
  const response=await fetch("/api/auth/me",{credentials:"same-origin"});
  if(!response.ok)return null;
  const data=await response.json();
  return data.user||null;
}

async function getEnrollments(){
  const response=await fetch("/api/student/enrollments",{credentials:"same-origin"});
  if(!response.ok)throw new Error("Unable to load enrollments");
  return response.json();
}

document.addEventListener("DOMContentLoaded",async()=>{
  const grid=document.querySelector("[data-my-courses]");
  const user=document.querySelector("[data-course-user]");
  const empty=document.querySelector("[data-empty-courses]");

  try{
    const session=await getCurrentUser();
    if(!session){localStorage.removeItem(CWU_SESSION_KEY);location.href="login.html";return;}
    localStorage.setItem(CWU_SESSION_KEY,JSON.stringify(session));
    if(user)user.textContent="Learning account: "+session.email;

    const result=await getEnrollments();
    const courses=result.enrollments||[];
    const total=document.querySelector("[data-course-total]");
    const average=document.querySelector("[data-course-average]");

    if(total)total.textContent=courses.length;
    if(average)average.textContent=courses.length?Math.round(courses.reduce((sum,c)=>sum+(c.progress||0),0)/courses.length)+"%":"0%";

    if(!grid)return;
    if(!courses.length){if(empty)empty.hidden=false;return;}

    courses.forEach(course=>{
      const card=document.createElement("article");
      card.className="course-card my-course-card";
      const progress=Math.max(0,Math.min(100,Number(course.progress)||0));
      card.innerHTML='<div class="course-card-top"><span class="icon">'+String(progress).padStart(2,"0")+'%</span><span class="course-level">Enrolled</span></div><h3>'+course.courseTitle+'</h3><p>Continue your enrolled CWU learning path and track your progress.</p><div class="progress-track"><span style="width:'+progress+'%"></span></div><div class="course-progress-row"><b>'+progress+'% complete</b><span>Server saved</span></div><a class="btn btn-small" href="course-learning.html?course='+encodeURIComponent(course.courseId)+'">Continue Learning →</a>';
      grid.appendChild(card);
    });
  }catch(error){
    console.error("My Courses error:",error);
    if(empty){empty.hidden=false;empty.querySelector("p").textContent="Unable to load your courses right now. Please try again.";}
  }
});
