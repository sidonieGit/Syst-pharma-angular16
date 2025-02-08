document.addEventListener("DOMContentLoaded", function () {
  // Récupérer les données du localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // Mettre à jour les valeurs dans le DOM
  document.getElementById("total-users").textContent = users.length;
  document.getElementById("total-pharmacies").textContent = pharmacies.length;
  document.getElementById("pending-orders").textContent = orders.filter(
    (order) => order.status === "pending"
  ).length;
});
