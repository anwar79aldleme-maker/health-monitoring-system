fetch("/api/patients", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
})
.then(res => {
  if (res.status === 401) {
    alert("Session expired, please login again");
    location.href = "login.html";
    return;
  }
  return res.json();
})
.then(data => {
  console.log(data);
});
