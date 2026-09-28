const CWU_SESSION_KEY="cwu_demo_session";
const CWU_COURSES=[
 {title:"Ethical Hacking Fundamentals",progress:65,lessons:12,quizzes:4,level:"Beginner",description:"Build a strong foundation in ethical hacking and responsible security testing."},
 {title:"Network Security",progress:30,lessons:10,quizzes:3,level:"Beginner",description:"Learn core concepts for protecting networks, access control and monitoring."},
 {title:"Cyber Security Fundamentals",progress:10,lessons:14,quizzes:5,level:"Beginner",description:"Understand security principles, threats, authentication and defensive practices."}
];
document.addEventListener("DOMContentLoaded",()=>{
 const session=getSession(),grid=document.querySelector("[data-my-courses]"),user=document.querySelector("[data-course-user]"),empty=document.querySelector("[data-empty-courses]");
 if(!session){location.href="login.html";return}
 if(user)user.textContent="Learning account: "+session.email;
 if(!grid)return;
 const total=document.querySelector("[data-course-total]"),average=document.querySelector("[data-course-average]");
 if(total)total.textContent=CWU_COURSES.length;
 if(average)average.textContent=Math.round(CWU_COURSES.reduce((sum,course)=>sum+course.progress,0)/CWU_COURSES.length)+"%";
 CWU_COURSES.forEach((course,index)=>{
  const card=document.createElement("article");card.className="course-card my-course-card";
  card.innerHTML='<div class="course-card-top"><span class="icon">'+String(course.progress).padStart(2,"0")+'%</span><span class="course-level">'+course.level+'</span></div><h3>'+course.title+'</h3><p>'+course.description+'</p><div class="course-meta"><span>'+course.lessons+' lessons</span><span>'+course.quizzes+' quizzes</span></div><div class="progress-track"><span style="width:'+course.progress+'%"></span></div><div class="course-progress-row"><b>'+course.progress+'% complete</b><span>'+Math.max(0,course.lessons-Math.round(course.lessons*course.progress/100))+' lessons remaining</span></div><a class="btn btn-small" href="course-learning.html?course='+encodeURIComponent(index+1)+'">Continue Learning →</a>';
  grid.appendChild(card);
 });
});
function getSession(){try{return JSON.parse(localStorage.getItem(CWU_SESSION_KEY)||"null")}catch{return null}}