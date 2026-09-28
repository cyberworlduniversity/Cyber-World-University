const LESSONS=[
 {title:"Security Fundamentals",topic:"Security Fundamentals",description:"Learn the core concepts of confidentiality, integrity, availability, threats, and basic defensive practices."},
 {title:"Reconnaissance Concepts",topic:"Reconnaissance Concepts",description:"Understand the purpose of reconnaissance and how security teams organize information during an authorized assessment."},
 {title:"Network Security Basics",topic:"Network Security Basics",description:"Review basic network security concepts including segmentation, access control, monitoring, and secure communication."},
 {title:"Web Application Security",topic:"Web Application Security",description:"Explore common web security concepts and defensive practices for building safer applications."}
];
let current=Number(localStorage.getItem("cwu_current_lesson")||1);
current=Math.min(Math.max(current,1),LESSONS.length);
document.addEventListener("DOMContentLoaded",()=>{
 const list=document.querySelector("[data-lesson-list]"),prev=document.querySelector("[data-prev]"),next=document.querySelector("[data-next]");
 if(!list)return;
 LESSONS.forEach((lesson,index)=>{
  const item=document.createElement("button");item.type="button";item.className="lesson-item";item.dataset.index=index+1;
  item.innerHTML="<b>Lesson "+(index+1)+"</b><br>"+lesson.title;
  item.addEventListener("click",()=>selectLesson(index+1));list.appendChild(item);
 });
 prev.addEventListener("click",()=>{if(current>1)selectLesson(current-1)});
 next.addEventListener("click",()=>{if(current<LESSONS.length)selectLesson(current+1);else location.href="quiz.html"});
 selectLesson(current);
});
function selectLesson(number){
 current=number;localStorage.setItem("cwu_current_lesson",String(current));
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
}