function login(){
 fetch("/api/auth",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
    email:email.value,
    password:password.value
  })
 })
 .then(r=>r.json())
 .then(d=>{
  if(d.success){
    localStorage.setItem("logged","true");
    location.href="patients.html";
  }else alert(d.error);
 });
}
