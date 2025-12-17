function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if(data.token) {
      // حفظ التوكن في localStorage
      localStorage.setItem("token", data.token);
      // الانتقال لصفحة المرضى
      window.location.href = "patients.html";
    } else {
      alert(data.error || "Login failed");
    }
  })
  .catch(err => {
    console.error("Login error:", err);
    alert("Server error");
  });
}
