function login() {
  fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => {
    if (res.status === 401) throw new Error("Wrong email or password");
    return res.json();
  })
  .then(data => {
    localStorage.setItem("token", data.token);
    window.location.href = "patients.html";
  })
  .catch(err => alert(err.message));
}
