const CWU_SESSION_KEY="cwu_demo_session";
const CWU_COURSES=[
 {title:"Ethical Hacking Fundamentals",progress:65,lessons:12,quizzes:4},
 {title:"Network Security",progress:30,lessons:10,quizzes:3},
 {title:"Cyber Security Fundamentals",progress:10,lessons:14,quizzes:5}
];
document.addEventListener("DOMContentLoaded",()=>{
 const session=getSession(),grid=document.querySelector("[data-my-courses]"),user=document.querySelector("[data-course-user]"),empty=document.querySelector("[data-empty-courses]");
 if(!session){location.href="login.html";return}
 if(user)user.textContent="Learning account: "+session.email;
 if(!grid)return;
 CWU_COURSES.forEach(course=>{
  const card=document.createElement("article");card.className="course-card";
  card.innerHTML='<span class="icon">'+course.progress+'%</span><h3>'+course.title+'</h3><p>'+course.lessons+' lessons · '+course.quizzes+' quizzes</p><div class="progress-track"><span style="width:'+course.progress+'%"></span></div><p>'+course.progress+'% complete</p><a class="btn btn-small" href="course-learning.html">Continue Learning →</a>';
  grid.appendChild(card);
 });
});
function getSession(){try{return JSON.parse(localStorage.getItem(CWU_SESSION_KEY)||"null")}catch{return null}}