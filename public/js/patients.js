const API = "/api/patients";
const token = localStorage.getItem("token");

function headers() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

function loadPatients() {
  fetch(API, { headers: headers() })
    .then(r => r.json())
    .then(data => {
      const tbody = document.getElementById("patients");
      tbody.innerHTML = "";
      data.forEach(p => {
        tbody.innerHTML += `
          <tr>
            <td>${p.name}</td>
            <td>${p.phone}</td>
            <td>${p.email}</td>
            <td>${p.device_name}</td>
            <td><button onclick="del(${p.id})">Delete</button></td>
          </tr>`;
      });
    });
}

function addPatient(e) {
  e.preventDefault();
  fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name: name.value,
      phone: phone.value,
      email: email.value,
      device_name: device.value
    })
  }).then(loadPatients);
}

function del(id) {
  fetch(API, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ id })
  }).then(loadPatients);
}

function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

loadPatients();
