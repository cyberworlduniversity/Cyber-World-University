const CWU_SESSION_KEY="cwu_demo_session";

function showFormMessage(text,type="info"){
  let box=document.querySelector(".form-message");
  if(!box){
    box=document.createElement("div");
    box.className="form-message";
    document.querySelector(".auth-card form")?.after(box);
  }
  box.className="form-message "+type;
  box.textContent=text;
}

async function postJson(url, payload){
  const response=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials:"same-origin",
    body:JSON.stringify(payload)
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||"Request failed");
  return data;
}

document.addEventListener("DOMContentLoaded",()=>{
  const register=document.querySelector("[data-register-form]");
  const login=document.querySelector("[data-login-form]");

  if(register) register.addEventListener("submit",async e=>{
    e.preventDefault();
    const data=new FormData(register);
    const name=String(data.get("name")||"").trim();
    const email=String(data.get("email")||"").trim().toLowerCase();
    const password=String(data.get("password")||"");

    try{
      await postJson("/api/auth/register",{name,email,password});
      showFormMessage("Registration successful. Redirecting to login...","success");
      setTimeout(()=>location.href="login.html",700);
    }catch(error){
      showFormMessage(error.message,"error");
    }
  });

  if(login) login.addEventListener("submit",async e=>{
    e.preventDefault();
    const data=new FormData(login);
    const email=String(data.get("email")||"").trim().toLowerCase();
    const password=String(data.get("password")||"");

    try{
      const result=await postJson("/api/auth/login",{email,password});
      localStorage.setItem(CWU_SESSION_KEY,JSON.stringify(result.user));
      location.href="dashboard.html";
    }catch(error){
      showFormMessage(error.message,"error");
    }
  });
});
