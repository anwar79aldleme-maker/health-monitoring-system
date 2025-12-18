const token = localStorage.getItem("token");

fetch("/api/health", {
  headers: { "Authorization": `Bearer ${token}` }
})
.then(r => r.json())
.then(data => {
  const labels = data.map(d => new Date(d.created_at).toLocaleTimeString());
  new Chart(spo2, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "SPO2", data: data.map(d => d.spo2) }]
    }
  });
  new Chart(hr, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Heart Rate", data: data.map(d => d.heartrate) }]
    }
  });
});
