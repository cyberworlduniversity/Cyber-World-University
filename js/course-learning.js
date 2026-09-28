const LESSONS=[
 {title:"Security Fundamentals",topic:"Security Fundamentals",description:"Learn the core concepts of confidentiality, integrity, availability, threats, and basic defensive practices."},
 {title:"Reconnaissance Concepts",topic:"Reconnaissance Concepts",description:"Understand the purpose of reconnaissance and how security teams organize information during an authorized assessment."},
 {title:"Network Security Basics",topic:"Network Security Basics",description:"Review basic network security concepts including segmentation, access control, monitoring, and secure communication."},
 {title:"Web Application Security",topic:"Web Application Security",description:"Explore common web security concepts and defensive practices for building safer applications."}
];
const COURSE_ID="ethical-hacking-fundamentals";
let current=1;

async function checkEnrollment(){
 const response=await fetch("/api/student/enrollments?courseId="+encodeURIComponent(COURSE_ID),{credentials:"same-origin"});
 if(response.status===401){location.href="login.html";return false;}
 if(!response.ok)throw new Error("Unable to verify enrollment");
 const data=await response.json();
 if(!data.enrolled){document.querySelector("[data-learning-gate]").hidden=false;document.querySelector("[data-learning-content]").hidden=true;return false;}
 return true;
}

async function loadProgress(){
 const response=await fetch("/api/student/progress?courseId="+encodeURIComponent(COURSE_ID),{credentials:"same-origin"});
 if(!response.ok){location.href="login.html";return null;}
 const data=await response.json();
 return data.progress?.[0]||{currentLesson:1,progress:0};
}

async function saveProgress(lesson){
 const response=await fetch("/api/student/progress",{
  method:"PATCH",credentials:"same-origin",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({courseId:COURSE_ID,lesson})
 });
 if(!response.ok)throw new Error("Unable to save course progress");
 return response.json();
}

document.addEventListener("DOMContentLoaded",async()=>{
 const list=document.querySelector("[data-lesson-list]"),prev=document.querySelector("[data-prev]"),next=document.querySelector("[data-next]");
 if(!list)return;
 try{
  if(!await checkEnrollment())return;
  const saved=await loadProgress();
  if(!saved)return;
  current=Math.min(Math.max(Number(saved.currentLesson)||1,1),LESSONS.length);
  LESSONS.forEach((lesson,index)=>{
   const item=document.createElement("button");item.type="button";item.className="lesson-item";item.dataset.index=index+1;
   item.innerHTML="<b>Lesson "+(index+1)+"</b><br>"+lesson.title;
   item.addEventListener("click",()=>selectLesson(index+1));list.appendChild(item);
  });
  prev.addEventListener("click",()=>{if(current>1)selectLesson(current-1)});
  next.addEventListener("click",async()=>{
   if(current<LESSONS.length)await selectLesson(current+1);else location.href="quiz.html?course="+encodeURIComponent(COURSE_ID);
  });
  await selectLesson(current);
 }catch(error){console.error("Learning progress error:",error);const message=document.querySelector("[data-learning-message]");if(message){message.hidden=false;message.textContent=error.message;}}
});

async function selectLesson(number){
 current=number;
 const lesson=LESSONS[current-1],progress=Math.round((current/LESSONS.length)*100);
 document.querySelector("[data-lesson-number]").textContent="LESSON "+current;
 document.querySelector("[data-lesson-title]").textContent=lesson.title;
 document.querySelector("[data-lesson-description]").textContent=lesson.description;
 document.querySelector("[data-lesson-topic]").textContent=lesson.topic;
 document.querySelector("[data-progress-text]").textContent=progress+"%";
 document.querySelector("[data-course-progress]").style.width=progress+"%";
 document.querySelector("[data-lesson-status]").textContent=current===LESSONS.length?"Ready for quiz":"In progress";
 document.querySelectorAll(".lesson-item").forEach(item=>item.classList.toggle("active",Number(item.dataset.index)===current));
 document.querySelector("[data-prev]").disabled=current===1;
 document.querySelector("[data-next]").textContent=current===LESSONS.length?"Continue to Quiz →":"Next Lesson →";
 try{await saveProgress(current);}catch(error){console.error(error);}
}
