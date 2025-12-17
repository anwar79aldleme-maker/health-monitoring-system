const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

async function fetchDevices() {
  const res = await fetch("/api/devices", { headers: { Authorization: "Bearer " + token } });
  const data = await res.json();
  renderTable(data);
}

function renderTable(data) {
  const tbody = document.querySelector("#devicesTable tbody");
  tbody.innerHTML = "";
  data.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.name}</td>
      <td>${d.description}</td>
      <td>
        <button onclick="editDevice(${d.id})">Edit</button>
        <button onclick="deleteDevice(${d.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function addDevice() {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  await fetch("/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ name, description })
  });
  fetchDevices();
}

async function deleteDevice(id) {
  await fetch("/api/devices", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ id })
  });
  fetchDevices();
}

function editDevice(id) {
  const name = prompt("New Device Name:");
  const description = prompt("New Description:");
  fetch("/api/devices", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ id, name, description })
  }).then(fetchDevices);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

fetchDevices();

