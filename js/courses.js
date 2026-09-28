function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.addEventListener("DOMContentLoaded",async()=>{
 const grid=document.querySelector("[data-dynamic-courses]");if(!grid)return;
 try{
  const r=await fetch("/api/courses");const d=await r.json();if(!r.ok)throw new Error(d.error||"Unable to load courses");
  grid.innerHTML="";
  const courses=d.courses||[];
  if(!courses.length){grid.innerHTML="<article class=\"course-card\"><h3>No published courses yet</h3><p>New courses will appear here after an administrator publishes them.</p></article>";return}
  courses.forEach((c,i)=>{const card=document.createElement("article");card.className="course-card";card.innerHTML='<span class="icon">'+String(i+1).padStart(2,"0")+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.description||"Explore this cybersecurity learning path.")+'</p><small>'+esc(c.category||"Cybersecurity")+' · '+esc(c.level||"Beginner")+(c.duration?" · "+esc(c.duration):"")+'</small><p><b>'+(c.isFree?"Free":"Paid")+'</b></p><a href="course.html?id='+encodeURIComponent(c.id)+'">View Course →</a>';grid.appendChild(card)});
  const tools=document.createElement("div");tools.className="course-tools";tools.innerHTML='<input id="courseSearch" type="search" placeholder="Search courses..." aria-label="Search courses"><select id="courseCategory" aria-label="Filter courses"><option value="all">All courses</option>'+[...new Set(courses.map(c=>c.category).filter(Boolean))].map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join("")+'</select><span id="courseCount"></span>';grid.parentNode.insertBefore(tools,grid);
  const search=tools.querySelector("#courseSearch"),category=tools.querySelector("#courseCategory"),count=tools.querySelector("#courseCount");
  function run(){const q=search.value.trim().toLowerCase(),cat=category.value;let n=0;grid.querySelectorAll(".course-card").forEach(card=>{const ok=(!q||card.textContent.toLowerCase().includes(q))&&(cat==="all"||card.textContent.includes(cat));card.hidden=!ok;if(ok)n++});count.textContent=n+" course"+(n===1?"":"s")+" found"}search.oninput=run;category.onchange=run;run();
 }catch(e){grid.innerHTML='<article class="course-card"><h3>Course library unavailable</h3><p>'+esc(e.message)+'</p></article>'}
});