const CWU_MESSAGES_KEY="cwu_contact_messages";
document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("[data-contact-form]"),message=document.querySelector("[data-contact-message]");
 if(!form)return;
 form.addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(form),name=data.get("name").trim(),email=data.get("email").trim(),subject=data.get("subject").trim(),body=data.get("message").trim();
  if(!name||!email||!subject||!body||!email.includes("@")){show("Please complete all fields with a valid email address.","error");return}
  let messages=[];try{messages=JSON.parse(localStorage.getItem(CWU_MESSAGES_KEY)||"[]")}catch{}
  messages.push({name,email,subject,message:body,date:new Date().toISOString()});
  localStorage.setItem(CWU_MESSAGES_KEY,JSON.stringify(messages));
  form.reset();show("Message submitted successfully in demo mode.","success");
 });
 function show(text,type){message.hidden=false;message.textContent=text;message.className="form-message "+type}
});