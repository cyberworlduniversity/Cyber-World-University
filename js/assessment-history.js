document.addEventListener("DOMContentLoaded",async()=>{
 const body=document.querySelector("[data-assessment-history]"),buttons=[...document.querySelectorAll("[data-filter]")];let history=[];
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
 const render=filter=>{
  const rows=history.filter(x=>filter==="all"||(filter==="quiz"?x.type==="Quiz":x.type==="Final Exam"));
  body.innerHTML=rows.length?rows.map(x=>'<tr><td><span class="assessment-type">'+esc(x.type)+'</span></td><td><strong>'+esc(x.title)+'</strong></td><td>'+esc(x.courseTitle)+'</td><td>'+x.score+' / '+x.total+'</td><td>'+x.percent+'%</td><td><span class="'+(x.passed?"result-pass":"result-review")+'">'+(x.passed?"Passed":"Needs Review")+'</span></td><td>'+new Date(x.submittedAt).toLocaleString()+'</td></tr>').join(""):'<tr><td colspan="7">No assessment results found.</td></tr>';
 };
 try{
  const me=await fetch("/api/auth/me",{credentials:"same-origin"});if(!me.ok){location.href="login.html";return}
  const r=await fetch("/api/student/assessment-history",{credentials:"same-origin"});if(!r.ok)throw new Error("history");
  const data=await r.json();history=data.history||[];render("all");
  buttons.forEach(btn=>btn.addEventListener("click",()=>{buttons.forEach(b=>b.classList.toggle("btn-outline",b!==btn));render(btn.dataset.filter)}));
 }catch(e){body.innerHTML='<tr><td colspan="7">Unable to load assessment history. Please try again.</td></tr>'}
});
