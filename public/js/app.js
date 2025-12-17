/* ===============================
   JWT Helpers
================================ */
function getToken() {
  return localStorage.getItem("token");
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
  }
  return token;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* ===============================
   API Helper
================================ */
async function api(url, method = "GET", data = null) {
  const token = getToken();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? "Bearer " + token : ""
    }
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(url, options);
  return res.json();
}

/* ===============================
   Patients Page Functions
================================ */
async function loadPatients() {
  requireAuth();
  const patients = await api("/api/patients");
  const tbl = document.getElementById("tbl");

  tbl.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Phone</th>
      <th>Email</th>
    </tr>
  `;

  patients.forEach(p => {
    tbl.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.phone}</td>
        <td>${p.email}</td>
      </tr>
    `;
  });
}

async function addPatient() {
  requireAuth();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  await api("/api/patients", "POST", { name, phone, email });
  loadPatients();
}

/* ===============================
   Charts Page
================================ */
async function loadCharts() {
  requireAuth();
  const data = await api("/api/health");

  new Chart(document.getElementById("heart"), {
    type: "line",
    data: {
      labels: data.map(x => x.created_at),
      datasets: [{
        label: "Heart Rate",
        data: data.map(x => x.heart_rate),
        borderColor: "#ef4444",
        tension: 0.3
      }]
    }
  });

  new Chart(document.getElementById("spo2"), {
    type: "line",
    data: {
      labels: data.map(x => x.created_at),
      datasets: [{
        label: "SpO2",
        data: data.map(x => x.spo2),
        borderColor: "#22c55e",
        tension: 0.3
      }]
    }
  });
}
