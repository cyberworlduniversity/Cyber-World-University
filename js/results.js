document.addEventListener("DOMContentLoaded",async()=>{
 const score=document.querySelector("[data-result-score]"),summary=document.querySelector("[data-result-summary]"),points=document.querySelector("[data-result-points]"),status=document.querySelector("[data-result-status]");
 try{
  const me=await fetch("/api/auth/me",{credentials:"include"});if(!me.ok)throw new Error("login");
  const response=await fetch("/api/student/quiz-results",{credentials:"include"});if(!response.ok)throw new Error("results");
  const data=await response.json(),result=data.results?.[0];
  if(!result){score.textContent="No Result";summary.textContent="Complete the quiz to see your score here.";points.textContent="0 / 0";status.textContent="Not attempted";return}
  score.textContent=result.percent+"%";summary.textContent="You scored "+result.score+" out of "+result.total+" questions.";
  points.textContent=result.score+" / "+result.total;status.textContent=result.percent>=60?"Passed":"Needs Review";
  status.parentElement.className=result.percent>=60?"result-pass":"result-review";
 }catch(error){score.textContent="Sign in required";summary.textContent="Please log in and complete a quiz to view your result.";points.textContent="—";status.textContent="Not available";}
});