function login() {
  fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim()
    })
  })
  .then(res => {
    if (res.status === 401) throw "Wrong email or password";
    if (!res.ok) throw "Server error";
    return res.json();
  })
  .then(data => {
    localStorage.setItem("token", data.token);
    location.href = "patients.html";
  })
  .catch(err => alert(err));
}
