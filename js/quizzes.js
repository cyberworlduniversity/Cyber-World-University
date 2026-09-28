const QUIZ_LIBRARY=[
 {title:"Security Fundamentals Quiz",category:"security",level:"beginner",questions:5,time:"5 minutes",description:"Test your understanding of core cybersecurity principles and defensive practices."},
 {title:"Network Security Quiz",category:"network",level:"beginner",questions:5,time:"5 minutes",description:"Review essential concepts in network protection, access control, and monitoring."},
 {title:"Web Security Quiz",category:"web",level:"intermediate",questions:5,time:"5 minutes",description:"Check your knowledge of common web security concepts and application defenses."},
 {title:"Ethical Hacking Basics Quiz",category:"security",level:"intermediate",questions:5,time:"5 minutes",description:"Practice foundational concepts used in authorized security testing."}
];
document.addEventListener("DOMContentLoaded",()=>{
 const grid=document.querySelector("[data-quiz-grid]"),search=document.querySelector("[data-quiz-search]"),cat=document.querySelector("[data-quiz-category]"),level=document.querySelector("[data-quiz-level]"),count=document.querySelector("[data-quiz-count]"),empty=document.querySelector("[data-quiz-empty]");
 QUIZ_LIBRARY.forEach((quiz,index)=>{
  const card=document.createElement("article");card.className="course-card";card.dataset.category=quiz.category;card.dataset.level=quiz.level;
  card.innerHTML='<span class="icon">Q'+(index+1)+'</span><h3>'+quiz.title+'</h3><p>'+quiz.description+'</p><p><b>'+quiz.level.charAt(0).toUpperCase()+quiz.level.slice(1)+'</b> · '+quiz.questions+' questions · '+quiz.time+'</p><a class="btn btn-small" href="quiz.html">Start Quiz →</a>';
  grid.appendChild(card);
 });
 function filter(){
  const q=search.value.trim().toLowerCase(),c=cat.value,l=level.value;let visible=0;
  [...grid.children].forEach(card=>{const text=card.textContent.toLowerCase(),show=(!q||text.includes(q))&&(c==="all"||card.dataset.category===c)&&(l==="all"||card.dataset.level===l);card.hidden=!show;if(show)visible++});
  count.textContent=visible+" quiz"+(visible===1?"":"zes")+" found";empty.hidden=visible!==0;
 }
 search.addEventListener("input",filter);cat.addEventListener("change",filter);level.addEventListener("change",filter);filter();
});