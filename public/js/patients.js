const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

async function fetchPatients() {
  const res = await fetch("/api/patients", { headers: { Authorization: "Bearer " + token } });
  const data = await res.json();
  renderTable(data);
}

function renderTable(data) {
  const tbody = document.querySelector("#patientsTable tbody");
  tbody.innerHTML = "";
  data.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.phone}</td>
      <td>${p.email}</td>
      <td>${p.device_name}</td>
      <td>
        <button onclick="editPatient(${p.id})">Edit</button>
        <button onclick="deletePatient(${p.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function addPatient() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const device_name = document.getElementById("device_name").value;
  await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ name, phone, email, device_name })
  });
  fetchPatients();
}

async function deletePatient(id) {
  await fetch("/api/patients", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ id })
  });
  fetchPatients();
}

function editPatient(id) {
  const name = prompt("New Name:");
  const phone = prompt("New Phone:");
  const email = prompt("New Email:");
  const device_name = prompt("New Device Name:");
  fetch("/api/patients", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ id, name, phone, email, device_name })
  }).then(fetchPatients);
}

function searchPatient() {
  const term = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#patientsTable tbody tr");
  rows.forEach(r => r.style.display = r.innerText.toLowerCase().includes(term) ? "" : "none");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

fetchPatients();
