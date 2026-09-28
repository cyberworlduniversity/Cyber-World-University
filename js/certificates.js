const CWU_SESSION_KEY="cwu_demo_session",CWU_QUIZ_KEY="cwu_last_quiz_result";
document.addEventListener("DOMContentLoaded",()=>{
 let session=null,result=null;
 try{session=JSON.parse(localStorage.getItem(CWU_SESSION_KEY)||"null");result=JSON.parse(localStorage.getItem(CWU_QUIZ_KEY)||"null")}catch{}
 const wrap=document.querySelector("[data-certificate-wrap]"),empty=document.querySelector("[data-certificate-empty]");
 if(!session||!result||result.percent<60){if(empty)empty.hidden=false;return}
 const name=session.name||"CWU Student",date=new Date(result.date||Date.now());
 document.querySelector("[data-certificate-user]").textContent="Certificate account: "+(session.email||"");
 document.querySelector("[data-certificate-name]").textContent=name;
 document.querySelector("[data-certificate-course]").textContent="Security Fundamentals";
 document.querySelector("[data-certificate-date]").textContent=date.toLocaleDateString();
 document.querySelector("[data-certificate-id]").textContent=makeId(name,date);
 if(wrap)wrap.hidden=false;
 document.querySelector("[data-print]").addEventListener("click",()=>window.print());
});
function makeId(name,date){const clean=name.replace(/[^a-z0-9]/gi,"").toUpperCase().slice(0,6)||"STUDENT";return "CWU-"+date.getFullYear()+"-"+clean+"-"+String(date.getTime()).slice(-5)}