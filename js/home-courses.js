function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function artClass(category=""){const c=category.toLowerCase();if(c.includes("ethical")||c.includes("hack"))return"hacking-art";if(c.includes("linux"))return"linux-art";if(c.includes("bug"))return"bug-art";return"security-art"}
document.addEventListener("DOMContentLoaded",async()=>{
 const grid=document.querySelector("[data-home-courses]");if(!grid)return;
 try{
  const r=await fetch("/api/courses");const d=await r.json();if(!r.ok)throw new Error(d.error||"Unable to load courses");
  const courses=(d.courses||[]).slice(0,4);grid.innerHTML="";
  if(!courses.length){grid.innerHTML='<article class="home-course-card home-course-empty"><div class="home-course-art security-art">CWU</div><h3>Courses Coming Soon</h3><p>Published courses will appear here when the administrator makes them available.</p><a href="courses.html">Open Course Library →</a></article>';return}
  courses.forEach((c,i)=>{
   const card=document.createElement("article");card.className="home-course-card";
   const art=c.thumbnail?'<div class="home-course-art home-course-image"><img src="'+esc(c.thumbnail)+'" alt="'+esc(c.title)+'"></div>':'<div class="home-course-art '+artClass(c.category)+'">'+esc((c.category||"CYBER SECURITY").toUpperCase())+'</div>';
   const price=c.isFree?"Free":"₹"+Number(c.price||0).toLocaleString("en-IN");
   card.innerHTML=art+'<h3>'+esc(c.title)+'</h3><p>'+esc(c.description||"Explore this cybersecurity learning path.")+'</p><div class="home-course-meta"><span>'+esc(c.category||"Cybersecurity")+'</span><span>'+esc(c.duration||"Self-paced")+'</span></div><div class="home-course-bottom"><strong>'+price+'</strong><a href="course.html?id='+encodeURIComponent(c.id)+'">View Course →</a></div>';
   grid.appendChild(card);
  });
 }catch(e){grid.innerHTML='<article class="home-course-card home-course-empty"><div class="home-course-art security-art">CWU</div><h3>Course library unavailable</h3><p>'+esc(e.message)+'</p><a href="courses.html">Open Course Library →</a></article>'}
});