const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

async function fetchHealth() {
  const res = await fetch("/api/health", { headers: { Authorization: "Bearer " + token } });
  const data = await res.json();
  return data;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function renderCharts() {
  const data = await fetchHealth();
  const labels = data.map(d => new Date(d.recorded_at).toLocaleString());
  const spo2 = data.map(d => d.spo2);
  const hr = data.map(d => d.heartrate);

  new Chart(document.getElementById("spo2Chart"), {
    type: "line",
    data: { labels, datasets: [{ label: "SPO2", data: spo2, borderColor: "blue", fill: false }] }
  });

  new Chart(document.getElementById("heartrateChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "Heart Rate", data: hr, borderColor: "red", fill: false }] }
  });
}

renderCharts();

