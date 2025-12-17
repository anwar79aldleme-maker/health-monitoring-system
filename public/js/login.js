async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorP = document.getElementById("error");
  errorP.textContent = "";

  if (!email || !password) {
    errorP.textContent = "Please enter email and password";
    return;
  }

  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.status === 200 && data.token) {
      // حفظ التوكن
      localStorage.setItem("token", data.token);
      // تحويل المستخدم إلى صفحة المرضى
      window.location.href = "patients.html";
    } else {
      // عرض الخطأ
      errorP.textContent = data.error || "Login failed";
    }
  } catch (err) {
    console.error(err);
    errorP.textContent = "Server error";
  }
}
