// Vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
  return localStorage.getItem("LoggedInUser") !== null;
}

// Récupérer l'utilisateur connecté
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("LoggedInUser"));
}

// Déconnexion de l'utilisateur
function logoutUser() {
  localStorage.removeItem("LoggedInUser");
  document.getElementById("userProfileSection").style.display = "none"; // Masquer le profil
  window.location.assign("../loginForm.html"); // Afficher le bouton de connexion
}

// Gestion de la déconnexion
document.getElementById("logoutButton").addEventListener("click", function () {
  logoutUser();
  Swal.fire({
    title: "Déconnexion",
    text: "Vous êtes déconnecté.",
    icon: "info",
  });
});
