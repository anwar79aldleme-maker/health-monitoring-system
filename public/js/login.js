async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorP = document.getElementById("error");
  errorP.textContent = "";

  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.status === 200 && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "patients.html";
    } else {
      errorP.textContent = data.error;
    }
  } catch (err) {
    errorP.textContent = "Server error";
  }
}
