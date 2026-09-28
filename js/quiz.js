const QUESTIONS=[
 {q:"Which principle helps limit a user's access to only what is necessary?",options:["Least privilege","Open access","Shared credentials","Anonymous access"],answer:0},
 {q:"Which practice adds an extra verification step during login?",options:["Multi-factor authentication","Password sharing","Open registration","Guest access"],answer:0},
 {q:"What does HTTPS primarily help protect?",options:["Data in transit","Monitor size","Keyboard layout","Screen brightness"],answer:0},
 {q:"Which is a strong password characteristic?",options:["Unique and hard to guess","Same on every site","Only a first name","A simple sequence"],answer:0},
 {q:"What is a useful defensive security practice?",options:["Regularly applying security updates","Disabling all backups","Sharing admin accounts","Ignoring alerts"],answer:0}
];
const COURSE_ID="ethical-hacking-fundamentals",QUIZ_ID="security-fundamentals";
let index=0,score=0,answered=false;

async function requireSession(){
 const response=await fetch("/api/auth/me",{credentials:"same-origin"});
 if(!response.ok){location.href="login.html";return false;}
 return true;
}
async function saveQuizResult(percent){
 const response=await fetch("/api/student/quiz-results",{
  method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({courseId:COURSE_ID,quizId:QUIZ_ID,score,total:QUESTIONS.length,percent})
 });
 if(!response.ok)throw new Error("Unable to save quiz result");
 return response.json();
}

document.addEventListener("DOMContentLoaded",async()=>{
 if(!await requireSession())return;
 render();
 document.querySelector("[data-next]").addEventListener("click",nextQuestion);
});

function render(){
 const item=QUESTIONS[index],options=document.querySelector("[data-options]"),feedback=document.querySelector("[data-feedback]");
 answered=false;feedback.hidden=true;options.innerHTML="";
 document.querySelector("[data-question-count]").textContent="Question "+(index+1)+" of "+QUESTIONS.length;
 document.querySelector("[data-score]").textContent="Score: "+score;
 document.querySelector("[data-quiz-progress]").style.width=((index+1)/QUESTIONS.length*100)+"%";
 document.querySelector("[data-question]").textContent=item.q;
 item.options.forEach((option,i)=>{
  const label=document.createElement("label");label.className="quiz-option";
  label.innerHTML='<input type="radio" name="answer" value="'+i+'"><span>'+option+'</span>';
  label.querySelector("input").addEventListener("change",()=>checkAnswer(i));options.appendChild(label);
 });
 document.querySelector("[data-next]").textContent=index===QUESTIONS.length-1?"Finish Quiz →":"Next Question →";
}

function checkAnswer(choice){
 if(answered)return;answered=true;
 const correct=choice===QUESTIONS[index].answer;if(correct)score++;
 document.querySelectorAll(".quiz-option").forEach((el,i)=>el.classList.toggle("correct",i===QUESTIONS[index].answer));
 const feedback=document.querySelector("[data-feedback]");feedback.hidden=false;
 feedback.textContent=correct?"Correct!":"Not quite. Review the highlighted correct answer.";
 feedback.className="form-message "+(correct?"success":"error");
 document.querySelector("[data-score]").textContent="Score: "+score;
}

async function nextQuestion(){
 if(!answered){
  const feedback=document.querySelector("[data-feedback]");feedback.hidden=false;
  feedback.textContent="Please select an answer first.";feedback.className="form-message error";return;
 }
 if(index<QUESTIONS.length-1){index++;render();return;}
 await finishQuiz();
}

async function finishQuiz(){
 const percent=Math.round(score/QUESTIONS.length*100);
 try{
  await saveQuizResult(percent);
  document.querySelector("[data-quiz-area]").hidden=true;
  const result=document.querySelector("[data-quiz-result]");result.hidden=false;
  result.innerHTML='<p class="eyebrow">QUIZ COMPLETE</p><h2>'+percent+'%</h2><p>Your result has been saved securely to your student account.</p><a class="btn" href="results.html">View Results</a> <button class="btn btn-outline" type="button" data-retry>Retry Quiz</button>';
  result.querySelector("[data-retry]").addEventListener("click",()=>{index=0;score=0;result.hidden=true;document.querySelector("[data-quiz-area]").hidden=false;render();});
 }catch(error){
  const feedback=document.querySelector("[data-feedback]");feedback.hidden=false;
  feedback.textContent=error.message;feedback.className="form-message error";
 }
}
