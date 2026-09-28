async function requestJson(url,options={}){const r=await fetch(url,{credentials:"same-origin",...options});let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Request failed");return d}
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
document.addEventListener("DOMContentLoaded",async()=>{
 try{
  const me=await requestJson("/api/auth/me");if(me.user?.role!=="admin"){location.href="dashboard.html";return}
  const d=await requestJson("/api/admin/assessment-analytics"),a=d.analytics;
  const set=(s,v)=>{const e=document.querySelector(s);if(e)e.textContent=v};
  set("[data-overall-attempts]",a.overall.attempted);set("[data-overall-average]",a.overall.averageScore+"%");set("[data-overall-pass]",a.overall.passRate+"%");set("[data-overall-passed]",a.overall.passed);
  set("[data-quiz-attempts]",a.quiz.attempted);set("[data-quiz-average]",a.quiz.averageScore+"%");set("[data-quiz-pass]",a.quiz.passRate+"%");
  set("[data-exam-attempts]",a.finalExam.attempted);set("[data-exam-average]",a.finalExam.averageScore+"%");set("[data-exam-pass]",a.finalExam.passRate+"%");
  document.querySelector("[data-course-performance]").innerHTML=a.coursePerformance.length?a.coursePerformance.map(x=>'<tr><td><strong>'+esc(x.courseTitle)+'</strong></td><td>'+x.attempts+'</td><td>'+x.passed+'</td><td>'+x.passRate+'%</td><td>'+x.averageScore+'%</td></tr>').join(""):'<tr><td colspan="5">No course assessment data.</td></tr>';
  document.querySelector("[data-recent]").innerHTML=a.recent.length?a.recent.map(x=>'<tr><td>'+esc(x.type)+'</td><td>'+x.score+' / '+x.total+'</td><td>'+x.percent+'%</td><td><span class="'+(x.passed?"result-pass":"result-review")+'">'+(x.passed?"Passed":"Needs Review")+'</span></td><td>'+new Date(x.submittedAt).toLocaleString()+'</td></tr>').join(""):'<tr><td colspan="5">No submissions.</td></tr>';
  document.querySelector("[data-admin-logout]")?.addEventListener("click",async()=>{await requestJson("/api/auth/logout",{method:"POST"});location.href="login.html"});
 }catch(e){location.href="admin.html"}
});
