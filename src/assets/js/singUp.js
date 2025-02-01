// Sélection des éléments du formulaire
let form = document.getElementById("signupForm");
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let psw = document.getElementById("psw");
let btn = document.getElementById("btn");

// Affiche dans la console pour vérifier que les éléments sont bien récupérés
console.log(email);
console.log(btn);

// Ajout d'un écouteur d'événement "submit" sur le formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut
  validation(); // Appelle la fonction de validation des données
});

// Fonction de validation du formulaire
function validation() {
  // Vérifie si un champ est vide
  if (
    username.value.trim() === "" ||
    email.value.trim() === "" ||
    password.value.trim() === "" ||
    psw.value.trim() === ""
  ) {
    // Utilisation de SweetAlert2 pour afficher une alerte stylée
    Swal.fire({
      title: "Erreur",
      text: "Tous les champs sont obligatoires !",
      icon: "warning", // Icône d'avertissement
    });
    return; // Sort de la fonction pour éviter d'aller plus loin
  }

  // Vérifie si les deux mots de passe correspondent
  if (password.value !== psw.value) {
    Swal.fire({
      title: "Erreur",
      text: "Les mots de passe ne correspondent pas !",
      icon: "error", // Icône d'erreur
    });
    return; // Sort de la fonction pour éviter d'aller plus loin
  }

  // Si toutes les validations sont réussies, stocker les données dans le localStorage
  localStorage.setItem("Username", username.value.trim());
  localStorage.setItem("Email", email.value.trim());
  localStorage.setItem("Password", password.value.trim());

  // Affiche une alerte de succès à l'utilisateur
  Swal.fire({
    title: "Succès",
    text: "Inscription réussie !",
    icon: "success", // Icône de succès
  });

  // Optionnel : Vous pouvez rediriger l'utilisateur vers une autre page après l'inscription
  window.location.href = "#products";
}
