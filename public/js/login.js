// التأكد من أن الحقول موجودة في الصفحة
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// دالة تسجيل الدخول
function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // التحقق من عدم ترك الحقول فارغة
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // مهم جدًا عند إرسال JSON
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (res.status === 400) {
        throw new Error("Bad Request: Missing email or password");
      } else if (res.status === 401) {
        throw new Error("Unauthorized: Wrong email or password");
      }
      return res.json();
    })
    .then(data => {
      if (data.token) {
        // تخزين التوكن في localStorage
        localStorage.setItem("token", data.token);
        // الانتقال إلى صفحة المرضى
        window.location.href = "patients.html";
      } else {
        alert(data.error || "Login failed");
      }
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
}

// ربط الزر مع الدالة
document.getElementById("loginBtn").addEventListener("click", login);
