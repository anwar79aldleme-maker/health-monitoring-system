function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("/api/auth",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.token){
      localStorage.setItem("token",d.token);
      window.location.href="patients.html";
    } else alert(d.error||"Login failed");
  })
  .catch(e=>{console.error(e); alert("Server error")});
}
