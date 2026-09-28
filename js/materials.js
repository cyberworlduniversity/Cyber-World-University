const MATERIALS=[
 {title:"Cybersecurity Fundamentals Notes",category:"fundamentals",label:"Fundamentals",type:"Notes",description:"Core concepts covering security principles, threats, authentication, and defensive practices."},
 {title:"Network Security Guide",category:"network",label:"Network Security",type:"Guide",description:"Reference material for network protection, access control, monitoring, and secure communication."},
 {title:"Web Application Security Notes",category:"web",label:"Web Security",type:"Notes",description:"Foundational concepts for understanding common web application security risks and defenses."},
 {title:"Digital Forensics Study Guide",category:"forensics",label:"Digital Forensics",type:"Guide",description:"Introductory study material covering evidence handling, investigation concepts, and forensic workflows."}
];
document.addEventListener("DOMContentLoaded",()=>{
 const grid=document.querySelector("[data-material-grid]"),search=document.querySelector("[data-material-search]"),category=document.querySelector("[data-material-category]"),count=document.querySelector("[data-material-count]"),empty=document.querySelector("[data-material-empty]");
 MATERIALS.forEach((material,index)=>{
  const card=document.createElement("article");card.className="course-card";card.dataset.category=material.category;
  card.innerHTML='<span class="icon">'+String(index+1).padStart(2,"0")+'</span><h3>'+material.title+'</h3><p>'+material.description+'</p><p><b>'+material.label+'</b> · '+material.type+'</p><a href="#" data-material-open>Open Material →</a>';
  card.querySelector("[data-material-open]").addEventListener("click",e=>{e.preventDefault();alert("Demo resource: "+material.title+"\nConnect your file storage or add a PDF/notes file to enable opening.");});
  grid.appendChild(card);
 });
 function filter(){
  const q=search.value.trim().toLowerCase(),cat=category.value;let visible=0;
  [...grid.children].forEach(card=>{const text=card.textContent.toLowerCase(),ok=(!q||text.includes(q))&&(cat==="all"||card.dataset.category===cat);card.hidden=!ok;if(ok)visible++});
  count.textContent=visible+" material"+(visible===1?"":"s")+" found";empty.hidden=visible!==0;
 }
 search.addEventListener("input",filter);category.addEventListener("change",filter);filter();
});