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

  // Récupérer l'utilisateur depuis le localStorage
  const storedUsername = localStorage.getItem("LoggedInUser");

  if (storedUsername) {
    document.getElementById("user-name").textContent = storedUsername;
    document.getElementById("logoutButton").classList.remove("d-none");
  }
});

// Charger les médicaments depuis un fichier JSON
async function fetchMedicaments() {
  try {
    const response = await fetch("../data/medicaments.json");
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

  // Ajouter la fonctionnalité de panier aux boutons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.getAttribute("data-name");
      const price = parseInt(this.getAttribute("data-price"));
      addToCart(name, price);
    });
  });
}

// Charger les médicaments et le panier au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  fetchMedicaments();
  loadCartFromLocalStorage(); // Charger le panier depuis le localStorage
});

/* ------------------- Commande et Paiement ------------------- */

// Fonction pour gérer la commande et le paiement
document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // Swal.fire({
  //   title: "Commande validée !",
  //   text: "Votre commande a été passée avec succès.",
  //   icon: "success",
  // }).then(() => {
  //   // Vider le panier après la commande
  //   cart = [];
  //   updateCartUI();
  //   saveCartToLocalStorage();
  // });

  // Sélection du mode de paiement
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.addEventListener("click", function () {
      document.querySelectorAll(".payment-method").forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");
    });
  });

  // Confirmation du paiement
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
  confirmPaymentBtn.addEventListener("click", function () {
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
    // Vider le panier après la commande
    cart = [];
    updateCartUI();
    saveCartToLocalStorage();
  });
});

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
document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // Ouvrir la modale de paiement
  const paymentModal = new bootstrap.Modal(
    document.getElementById("paymentModal")
  );
  paymentModal.show();
});

// Fermer la modale de paiement (par exemple, après un clic sur un bouton "Payer")

confirmPaymentBtn.addEventListener("click", () => {
  paymentModal.hide();
  // Ajouter ici le code pour effectuer le paiement

  // Confirmer le paiement
  document
    .getElementById("confirmPaymentBtn")
    .addEventListener("click", function () {
      const selectedMethod = document.querySelector(".payment-method.active");
      if (!selectedMethod) {
        alert("Veuillez choisir un mode de paiement !");
        return;
      }

      const methodName =
        selectedMethod.id === "orange-money" ? "Orange Money" : "MTN Money";
      alert(`Paiement confirmé avec ${methodName} !`);

      cart = [];
      updateCartUI();
      saveCartToLocalStorage();
      paymentModal.hide();
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Charger le panier depuis le localStorage si disponible
function loadCartFromLocalStorage() {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  if (savedCart) {
    cart = savedCart;
  }
  updateCartUI(); // Met à jour l'interface du panier
}

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
