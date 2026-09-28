const CWU_QUIZ_KEY="cwu_last_quiz_result";
document.addEventListener("DOMContentLoaded",()=>{
 let result=null;
 try{result=JSON.parse(localStorage.getItem(CWU_QUIZ_KEY)||"null")}catch{}
 const score=document.querySelector("[data-result-score]"),summary=document.querySelector("[data-result-summary]"),points=document.querySelector("[data-result-points]"),status=document.querySelector("[data-result-status]");
 if(!result){
  score.textContent="No Result";summary.textContent="Complete the quiz to see your score here.";points.textContent="0 / 0";status.textContent="Not attempted";return;
 }
 score.textContent=result.percent+"%";
 summary.textContent="You scored "+result.score+" out of "+result.total+" questions.";
 points.textContent=result.score+" / "+result.total;
 status.textContent=result.percent>=60?"Passed":"Needs Review";
 status.parentElement.className=result.percent>=60?"result-pass":"result-review";
});