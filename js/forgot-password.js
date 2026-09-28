const CWU_USERS_KEY="cwu_demo_users";
document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("[data-reset-form]"),message=document.querySelector("[data-reset-message]");
 if(!form)return;
 form.addEventListener("submit",e=>{
  e.preventDefault();const email=new FormData(form).get("email").trim().toLowerCase();
  if(!email||!email.includes("@")){show("Please enter a valid email address.","error");return}
  let users=[];try{users=JSON.parse(localStorage.getItem(CWU_USERS_KEY)||"[]")}catch{}
  const exists=users.some(user=>user.email===email);
  if(exists){show("Demo reset request accepted. Please contact CWU support to complete account recovery.","success")}else{show("No demo account was found for this email address.","error")}
 });
 function show(text,type){message.hidden=false;message.textContent=text;message.className="form-message "+type}
});