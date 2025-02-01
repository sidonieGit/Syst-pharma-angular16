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
  cart = []; // Réinitialiser le panier à la déconnexion
  updateCartUI(); // Mettre à jour l'interface
  localStorage.removeItem("cart"); // Supprimer le panier stocké
  document.getElementById("userProfileSection").style.display = "none"; // Masquer le profil
  document.getElementById("accountSection").style.display = "inline"; // Afficher le bouton de connexion
}
if (isUserLoggedIn()) {
  const user = getLoggedInUser();
  setLoggedInUser(user); // Mettre à jour l'affichage avec les informations de l'utilisateur
}

// fonction pour gérer la déconnexion
function gestionnaireEvenementDeconnection() {
  logoutUser();
  document.getElementById("user-name").innerHTML = "Mon Compte";
  updateProfileUI(Moncompte);
  Swal.fire({
    title: "Déconnexion",
    text: "Vous êtes déconnecté.",
    icon: "info",
  });
}
// event listener pour gérer la déconnexion
document
  .getElementById("logoutButton")
  .addEventListener("click", gestionnaireEvenementDeconnection);
// Sélection du bouton de connexion
const login = document.getElementById("login");

// Gestion de l'événement "click" sur le bouton de connexion
login.onclick = (e) => {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut

  // Récupération des valeurs des champs "nom d'utilisateur" et "mot de passe"
  const usernameAddress = document.getElementById("username").value.trim();
  const passwordAddress = document.getElementById("password").value.trim();

  // Récupération des informations enregistrées dans le localStorage
  const getUser = localStorage.getItem("Username")?.trim().toLowerCase();
  const getPass = localStorage.getItem("Password")?.trim().toLowerCase();

  // Vérification si les champs sont vides
  if (usernameAddress === "" || passwordAddress === "") {
    Swal.fire({
      title: "Erreur",
      text: "Les champs ne doivent pas être vides",
      icon: "warning",
    });
  } else {
    // Vérification si les identifiants sont corrects
    if (
      usernameAddress.toLowerCase() === getUser &&
      passwordAddress.toLowerCase() === getPass
    ) {
      // Enregistrer l'utilisateur dans le localStorage (session utilisateur)
      localStorage.setItem(
        "LoggedInUser",
        JSON.stringify({ username: usernameAddress }) //mettre en string car le localstorage ne prend que les string
      );

      // Mise à jour de l'interface utilisateur
      updateProfileUI(usernameAddress);
      if (isUserLoggedIn()) {
        const user = getLoggedInUser();
        setLoggedInUser(user); // Mettre à jour l'affichage avec les informations de l'utilisateur
      }
      Swal.fire({
        title: "Succès",
        text: `Connexion réussie! Bonjour ${usernameAddress}`,
        icon: "success",
      });

      // Cacher le bouton de connexion et afficher le bouton de déconnexion
      // document.getElementById("logoutButton").classList.add("d-none");
      document.getElementById("accountModal").classList.remove("d-none");

      // Fermer la modale de connexion
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("accountModal")
      );
      modal.hide();
    } else {
      Swal.fire({
        title: "Erreur",
        text: "Le nom d'utilisateur ou le mot de passe est incorrect",
        icon: "error",
      });
    }
  }
};

// Enregistrer la session utilisateur après connexion
function setLoggedInUser(user) {
  document.getElementById("accountModal").classList.remove("d-none");
  // Rendre visible le bouton de déconnexion
  document.getElementById("logoutButton").classList.remove("d-none");
  localStorage.setItem("LoggedInUser", JSON.stringify(user));
  document.getElementById("userName").textContent = `${user.username}`; // Afficher le nom de l'utilisateur
  document.getElementById("userProfileSection").style.display = "inline"; // Afficher la section du profil
  document.getElementById("accountSection").style.display = "none"; // Cacher la section de connexion
}

// Fonction pour mettre à jour l'interface utilisateur après connexion
function updateProfileUI(username) {
  // Mettre à jour le nom d'utilisateur affiché dans la navbar
  document.getElementById("user-name").textContent = `Bonjour, ${username}`;

  // Afficher le menu déroulant du profil (avec les informations)
  const profileInfo = document.getElementById("profileInfo");
  profileInfo.style.display = "block"; // Montre la section déroulante du profil
}

// Gestion de la déconnexion
document.getElementById("logoutButton").addEventListener("click", function () {
  localStorage.removeItem("LoggedInUser"); // Supprimer la session utilisateur

  // Réinitialiser l'interface utilisateur
  document.getElementById("user-name").textContent = "Mon Compte";
  document.getElementById("logoutButton").classList.add("d-none");

  // Masquer les informations de profil
  document.getElementById("profileInfo").style.display = "none";
});

// Vérifier l'état de connexion au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = JSON.parse(localStorage.getItem("LoggedInUser")); //recupère l'utilisateur connecté et non celui qui est dans le localStorage

  if (loggedInUser && loggedInUser !== null) {
    // Si l'utilisateur est connecté, mettre à jour l'interface
    updateProfileUI(loggedInUser.username);
  }
});

////////////////////////////////////////

// Fonctionnalité pour basculer entre les formulaires de connexion et d'inscription
document.getElementById("loginButton").addEventListener("click", function () {
  document.getElementById("loginForm").classList.remove("d-none");
  document.getElementById("signupForm").classList.add("d-none");
});

document.getElementById("signupButton").addEventListener("click", function () {
  document.getElementById("signupForm").classList.remove("d-none");
  document.getElementById("loginForm").classList.add("d-none");
});

// Afficher le formulaire de connexion par défaut au chargement
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").classList.remove("d-none");
  document.getElementById("signupForm").classList.add("d-none");
});

// Charger les médicaments depuis un fichier JSON
async function fetchMedicaments() {
  try {
    const response = await fetch("data/medicaments.json");
    if (!response.ok) {
      throw new Error("Erreur de chargement des médicaments");
    }
    const medicaments = await response.json();
    displayMedicaments(medicaments);
  } catch (error) {
    console.error("Erreur lors de la récupération des médicaments :", error);
    document.getElementById("products").innerHTML =
      "<p>Erreur lors du chargement des médicaments. Vérifiez le fichier JSON.</p>";
  }
}

// Afficher les médicaments sur la page
function displayMedicaments(medicaments) {
  const productContainer = document.getElementById("products");
  productContainer.innerHTML = ""; // Vider le conteneur avant d'ajouter des produits

  medicaments.forEach((medicament) => {
    const productCard = `
      <div class="col-md-4 mb-4">
        <div class="card product-card">
          <img src="${medicament.image}" class="card-img-top" alt="${medicament.name}">
          <div class="card-body">
            <h5 class="card-title">${medicament.name}</h5>
            <p class="card-text">${medicament.description}</p>
            <p class="card-text">Prix : ${medicament.price} FCFA</p>
            <button class="btn btn-primary add-to-cart" data-name="${medicament.name}" data-price="${medicament.price}">Ajouter au panier</button>
          </div>
        </div>
      </div>`;
    productContainer.innerHTML += productCard;
  });

  // Fonction pour ajouter au panier
  function gestionnaireEvenementAddCart() {
    const name = this.getAttribute("data-name");
    const price = parseInt(this.getAttribute("data-price"));
    addToCart(name, price);
  }
  // Ajouter la fonctionnalité de panier aux boutons (fonction pour ajouter au panier)
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", gestionnaireEvenementAddCart);
  });
}

// Fonction pour charger les médicaments et le panier au chargement de la page
function gestionnaireEvenementLoadMedicaments() {
  fetchMedicaments();
  loadCartFromLocalStorage(); // Charger le panier depuis le localStorage
}
// Charger les médicaments et le panier au chargement de la page
document.addEventListener(
  "DOMContentLoaded",
  gestionnaireEvenementLoadMedicaments
);

/* ------------------- Commande et Paiement ------------------- */

// Confirmation du paiement
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
confirmPaymentBtn.addEventListener(
  "click",
  gestionnaireEvenementConfirmPayment
);
// Fonction pour gérer la confirmation du paiement
function gestionnaireEvenementConfirmPayment() {
  const selectedMethod = document.querySelector(".payment-method.active");
  if (!selectedMethod) {
    alert("Veuillez choisir un mode de paiement !");
    return;
  }
  const methodName =
    selectedMethod.id === "orange-money" ? "Orange Money" : "MTN Money";
  alert(`Paiement confirmé avec ${methodName} !`);

  // Simuler l'envoi d'un email de confirmation
  sendConfirmationEmail();
  // Fermer la modale de paiement
  const paymentModal = bootstrap.Modal.getInstance(
    document.getElementById("paymentModal")
  );
  paymentModal.hide();
}
// Ajouter l'événement pour gérer la commande et le paiement
document
  .getElementById("checkoutBtn")
  .addEventListener("click", gestionnaireEvenementCheckoutBtnCommandePayement);

// Fonction pour gérer la commande et le paiement
function gestionnaireEvenementCheckoutBtnCommandePayement() {
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  function gestionnaireEvenementCheckpaiement() {
    document.querySelectorAll(".payment-method").forEach((item) => {
      item.classList.remove("active");
    });
    this.classList.add("active");
  }

  // Sélection du mode de paiement
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.addEventListener("click", gestionnaireEvenementCheckpaiement);
  });
}
// Fonction simulée pour envoyer un email de confirmation
function sendConfirmationEmail() {
  Swal.fire({
    title: "Confirmation",
    text: "Un email de confirmation avec votre facture a été envoyé.",
    icon: "success",
  });
}

let cart = []; // Le panier de l'utilisateur

// Sauvegarder le panier dans le localStorage pour l'utilisateur connecté
function saveCartToLocalStorage() {
  if (isUserLoggedIn()) {
    const user = getLoggedInUser();
    localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
  }
}

// Ajouter un article au panier
function addToCart(name, price) {
  const existingItemIndex = cart.findIndex((item) => item.name === name);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  saveCartToLocalStorage();
}

// Supprimer un article du panier
function removeFromCart(name) {
  // Trouver l'index de l'élément à modifier
  const index = cart.findIndex((item) => item.name === name);

  // Si l'élément est trouvé, diminuer sa quantité
  if (index !== -1) {
    cart[index].quantity--;

    // Si la quantité atteint 0, supprimer l'élément
    if (cart[index].quantity === 0) {
      cart.splice(index, 1);
    }

    updateCartUI();
    saveCartToLocalStorage();
  }
}

// Fonction pour gérer le paiement
function gestionnaireEvenementgererPaiement() {
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // Vérifier si l'utilisateur est connecté avant de continuer
  if (!isUserLoggedIn()) {
    Swal.fire({
      title: "Erreur",
      text: "Vous devez être connecté pour passer une commande.",
      icon: "error",
    });
    return;
  }
  // Ouvrir la modale de paiement (si l'utilisateur est connecté)
  const paymentModal = new bootstrap.Modal(
    document.getElementById("paymentModal")
  );
  paymentModal.show();
}
// Fonction pour gérer le paiement
document
  .getElementById("checkoutBtn")
  .addEventListener("click", gestionnaireEvenementgererPaiement);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//fonction pour charger le panier
function gestionnaireEvenementChargerPanier() {
  if (isUserLoggedIn()) {
    const user = getLoggedInUser();
    const savedCart = JSON.parse(localStorage.getItem(`cart_${user.username}`));
    if (savedCart) {
      cart = savedCart;
      console.log("Panier chargé:", cart);
    }
    updateCartUI(); // Mettre à jour l'interface du panier
  }
}
// Ajouter l'événement pour charger le panier
// Vérifier l'état de connexion et charger le panier
document.addEventListener(
  "DOMContentLoaded",
  gestionnaireEvenementChargerPanier
);

// Fonction pour mettre à jour l'interface utilisateur en fonction du contenu du panier

function updateCartUI() {
  const cartItemsList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItemsList.innerHTML = ""; // Vider la liste du panier dans l'interface
  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `${item.name} (x${item.quantity}) <span>${
      item.price * item.quantity
    } FCFA</span>
      <button class="btn btn-sm btn-danger remove-item" data-name="${
        item.name
      }">Supprimer</button>`;

    cartItemsList.appendChild(listItem);
    total += item.price * item.quantity;
    itemCount += item.quantity;
  });

  cartCount.textContent = itemCount;
  cartTotal.textContent = total;

  // Ajouter l'événement pour supprimer un article
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      removeFromCart(this.getAttribute("data-name"));
    });
  });
}

// Ajouter un article au panier
function addItemToCart(item) {
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart)); // Enregistrer le panier dans le localStorage
  updateCartUI(); // Met à jour l'interface après ajout
}

// Réinitialiser le panier, par exemple lors de la déconnexion
function clearCart() {
  cart = [];
  localStorage.removeItem("cart"); // Supprimer le panier du localStorage
  updateCartUI(); // Mettre à jour l'interface
}

// Charger le panier depuis le localStorage si disponible
function loadCartFromLocalStorage() {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  if (savedCart) {
    cart = savedCart; // Charger le panier sauvegardé
  }
  updateCartUI(); // Mettre à jour l'interface utilisateur avec le panier
}

// Appeler cette fonction au démarrage pour charger le panier
loadCartFromLocalStorage();

// fonction pour gérer le formulaire de contact
function gestionnaireEvenementContactForm() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("exampleFormControlTextarea1").value;
  Swal.fire({
    title: "Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    icon: "success",
  });
}
// Ajouter l'événement pour gérer le formulaire de contact
const contactBtn = document.getElementById("contactBtn");
contactBtn.addEventListener("click", gestionnaireEvenementContactForm);
