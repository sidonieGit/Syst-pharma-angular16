let contactForm = document.querySelector("form");
let fields = document.querySelectorAll("input[required]");

fields.forEach((field) => {
  field.addEventListener(
    "focus",
    () => {
      resetField(field);
    },
    false
  );

  field.addEventListener(
    "blur",
    () => {
      validateField(field);
    },
    false
  );
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Réinitialiser tous les champs avant de valider
  fields.forEach((field) => {
    resetField(field);
  });

  let valid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      valid = false;
    }
  });

  if (valid) {
    // Si tous les champs sont valides, soumettre le formulaire
    e.target.submit();
  }
});

function validateField(field) {
  if (field.checkValidity()) {
    return true;
  } else {
    field.classList.add("invalid");

    // Insérer un message d'erreur dans l'élément frère précédent
    if (field.previousElementSibling) {
      field.insertAdjacentHTML(
        "afterend",
        `<span class='msg'>${field.validationMessage}</span>`
      );
    }
    return false;
  }
}

function resetField(field) {
  let fieldLabel = field.previousElementSibling;
  field.classList.remove("invalid");

  // Supprimer les messages d'erreur (span.msg) dans le label précédent
  if (fieldLabel && fieldLabel.querySelector(".msg")) {
    let msg = fieldLabel.querySelector(".msg");
    fieldLabel.removeChild(msg);
  }
}

function myFunction(x, y = 10) {
  return x + y;
}

document.getElementById("demo").innerHTML =
  "Ceci est le resultat de ma fonction JS  " + myFunction(5);

let card = document.getElementById("card");

function gestionnaireEvenementClick() {
  card.style.backgroundColor = "white";
  card.style.color = "black";
  card.innerHTML = "Vous avez cliqué sur cette zone";
}
function gestionnaireEvenementMouse() {
  card.textContent = "La souri survole";
  card.style.backgroundColor = "green";
  setTimeout(() => {
    // Fermer l'alerte (bien que cela ne soit pas garanti)
    // ... (code pour fermer l'alerte, si possible)
  }, 2000); // Fermer l'alerte après 2 secondes
}
function gestionnaireEvenementdoubleClick() {
  // Ferme la boîte de dialogue si elle est ouverte
  card.innerHTML = "Double click";
}
function gestionnaireEvenementMouseOut() {
  // Ferme la boîte de dialogue si elle est ouverte
  card.innerHTML = "Au revoir";
}

card.addEventListener("click", gestionnaireEvenementClick);
card.addEventListener("mouseover", gestionnaireEvenementMouse);
card.addEventListener("mouseout", gestionnaireEvenementMouseOut);
card.addEventListener("dblclick", gestionnaireEvenementdoubleClick);
// <button onclick="this.innerHTML = Date()">The time is?</button>
