// Sélectionner les éléments HTML
const medicamentForm = document.getElementById("medicamentForm");
const medicamentList = document.getElementById("medicamentList");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

// Initialiser l'application au chargement de la page
document.addEventListener("DOMContentLoaded", loadMedicamentsFromStorage);

// Gérer l'ajout d'un médicament via le formulaire
medicamentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validation des champs
  if (!name || !price || !description) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // Créer un objet médicament
  const medicament = {
    id: Date.now(),
    name,
    price,
    description,
  };

  // Ajouter le médicament à la liste du DOM et le stocker dans le localStorage
  addMedicamentToList(medicament);
  saveMedicamentToStorage(medicament);

  // Réinitialiser le formulaire après ajout
  medicamentForm.reset();
});

// Fonction pour ajouter un médicament à la liste du DOM
function addMedicamentToList(medicament) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center mt-3";
  li.dataset.id = medicament.id;

  li.innerHTML = `
    <div>
      <h5>${medicament.name}</h5>
      <p>Prix: ${medicament.price} €</p>
      <p>${medicament.description}</p>
    </div>
    <div>
      <button class="btn btn-warning btn-sm edit-btn mr-2">Modifier</button>
      <button class="btn btn-danger btn-sm delete-btn">&times;</button>
    </div>
  `;

  // Ajouter écouteurs pour modifier et supprimer
  li.querySelector(".edit-btn").addEventListener("click", function () {
    editMedicament(medicament);
  });
  li.querySelector(".delete-btn").addEventListener("click", function () {
    li.remove();
    removeMedicamentFromStorage(medicament.id);
    toggleDeleteSelectedBtn();
  });

  medicamentList.appendChild(li);
}

// Fonction pour modifier un médicament
function editMedicament(medicament) {
  // Préremplir les champs du formulaire avec les données du médicament à modifier
  document.getElementById("name").value = medicament.name;
  document.getElementById("price").value = medicament.price;
  document.getElementById("description").value = medicament.description;

  // Cacher le bouton Ajouter et afficher le bouton Confirmer
  const confirmButton = document.getElementById("confirmButton");
  const addButton = document.getElementById("addButton");
  confirmButton.style.display = "inline-block"; // Afficher le bouton Confirmer
  addButton.style.display = "none"; // Cacher le bouton Ajouter

  // Ajouter un gestionnaire d'événement pour le bouton Confirmer
  confirmButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Mettre à jour les propriétés du médicament
    medicament.name = document.getElementById("name").value;
    medicament.price = document.getElementById("price").value;
    medicament.description = document.getElementById("description").value;

    // Sauvegarder les modifications et recharger la page
    saveMedicamentToStorage(medicament);
    location.reload(); // Recharger la page pour appliquer les modifications
  });
}

// Fonction pour charger les médicaments depuis le localStorage
function loadMedicamentsFromStorage() {
  const medicamentsStockesCompresses = localStorage.getItem("medicaments");
  const medicamentsStockes = medicamentsStockesCompresses
    ? JSON.parse(LZString.decompress(medicamentsStockesCompresses))
    : [];

  medicamentsStockes.forEach((medicament) => {
    addMedicamentToList(medicament);
  });
}

// Fonction pour sauvegarder un médicament dans le localStorage
function saveMedicamentToStorage(medicament) {
  let medicamentsStockesCompresses = localStorage.getItem("medicaments");
  let medicamentsStockes = medicamentsStockesCompresses
    ? JSON.parse(LZString.decompress(medicamentsStockesCompresses))
    : [];

  const existingIndex = medicamentsStockes.findIndex(
    (m) => m.id === medicament.id
  );

  if (existingIndex !== -1) {
    medicamentsStockes[existingIndex] = medicament;
  } else {
    medicamentsStockes.push(medicament);
  }

  localStorage.setItem(
    "medicaments",
    LZString.compress(JSON.stringify(medicamentsStockes))
  );
}

// Fonction pour supprimer un médicament du localStorage
function removeMedicamentFromStorage(medicamentId) {
  let medicamentsStockes =
    JSON.parse(LZString.decompress(localStorage.getItem("medicaments"))) || [];
  medicamentsStockes = medicamentsStockes.filter(
    (medicament) => medicament.id !== medicamentId
  );
  localStorage.setItem(
    "medicaments",
    LZString.compress(JSON.stringify(medicamentsStockes))
  );
  //
  toggleDeleteSelectedBtn();
}

// Fonction pour basculer l'affichage du bouton "Supprimer la sélection"
function toggleDeleteSelectedBtn() {
  const checkboxes = document.querySelectorAll(".select-checkbox:checked");
  deleteSelectedBtn.style.display = checkboxes.length >= 2 ? "block" : "none";
}

// Supprimer les médicaments sélectionnés
deleteSelectedBtn.addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(".select-checkbox:checked");
  checkboxes.forEach((checkbox) => {
    const medicamentItem = checkbox.closest("li");
    const medicamentId = medicamentItem.dataset.id;
    medicamentItem.remove();
    removeMedicamentFromStorage(Number(medicamentId));
  });
  toggleDeleteSelectedBtn();
});
