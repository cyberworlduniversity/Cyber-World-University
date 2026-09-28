document.addEventListener("DOMContentLoaded",async()=>{
 const score=document.querySelector("[data-result-score]"),summary=document.querySelector("[data-result-summary]"),points=document.querySelector("[data-result-points]"),status=document.querySelector("[data-result-status]"),title=document.querySelector("[data-result-title]"),course=document.querySelector("[data-result-course]"),date=document.querySelector("[data-result-date]");
 const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
 try{
  const me=await fetch("/api/auth/me",{credentials:"include"});if(!me.ok)throw new Error("login");
  const params=new URLSearchParams(location.search),quizId=params.get("quizId")||"";
  const response=await fetch("/api/student/quiz-results"+(quizId?"?quizId="+encodeURIComponent(quizId):""),{credentials:"include"});
  if(!response.ok)throw new Error("results");
  const data=await response.json(),result=data.results?.[0];
  if(!result){
   score.textContent="No Result";summary.textContent="Complete a quiz to see your score here.";points.textContent="0 / 0";status.textContent="Not attempted";
   if(title)title.textContent="Quiz Result";return;
  }
  score.textContent=result.percent+"%";
  summary.textContent="You scored "+result.score+" out of "+result.total+" questions.";
  points.textContent=result.score+" / "+result.total;
  status.textContent=result.passed?"Passed":"Needs Review";
  status.parentElement.className=result.passed?"result-pass":"result-review";
  if(title)title.textContent=escapeHtml(result.quizTitle);
  if(course)course.textContent=escapeHtml(result.courseTitle);
  if(date)date.textContent=result.submittedAt?new Date(result.submittedAt).toLocaleString():"—";
  const retry=document.querySelector("[data-retry-quiz]");
  if(retry&&result.quizId)retry.href="quiz.html?id="+encodeURIComponent(result.quizId);
 }catch(error){
  score.textContent="Sign in required";summary.textContent="Please log in and complete a quiz to view your result.";points.textContent="—";status.textContent="Not available";
 }
});
