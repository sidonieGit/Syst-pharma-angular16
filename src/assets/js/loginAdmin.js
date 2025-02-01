// Vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
  return localStorage.getItem("LoggedInUser") !== null;
}

// Récupérer l'utilisateur connecté
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("LoggedInUser"));
}

document.addEventListener("DOMContentLoaded", function () {
  const adminLoginForm = document.getElementById("adminLoginForm");

  // Gestion de la soumission du formulaire de connexion
  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    // Vérification des identifiants (à remplacer par une vraie validation côté serveur)
    if (email === "admin@pharma.com" && password === "Promo2024FUll*") {
      alert("Connexion réussie !");
      // Enregistrer l'utilisateur dans le localStorage (session utilisateur)
      localStorage.setItem(
        "LoggedInUser",
        JSON.stringify({ adminEmail: email })
      );

      // Mise à jour de l'interface utilisateur

      if (isUserLoggedIn()) {
      }
      Swal.fire({
        title: "Succès",
        text: `Connexion réussie! Bonjour ${email}`,
        icon: "success",
      });

      // Montrer les options d'ajout/suppression après connexion
      document.getElementById("userProfileSection").style.display = "block"; // Afficher profil admin
      window.location.assign("../src/createdMedoc.html");

      adminLoginForm.style.display = "none"; // Cacher form connexion
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  });

  // Gestion du bouton "Mot de passe oublié" (peut être adapté pour ouvrir une autre modale ou envoyer un email)
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Fonction 'Mot de passe oublié' non encore implémentée.");
  });
});
