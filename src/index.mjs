import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVH5BXrkJHS4eRgd-xE0zh0PQoJvMTwg0",
  authDomain: "test-fcb3d.firebaseapp.com",
  databaseURL:
    "https://test-fcb3d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-fcb3d",
  storageBucket: "test-fcb3d.firebasestorage.app",
  messagingSenderId: "36224026577",
  appId: "1:36224026577:web:b25ecc04ddc6856f57c2f0",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const pseudo = user.displayName;
    document.cookie = "pseudo=" + pseudo + "; path=/";
    document.cookie = "uid=" + user.uid + "; path=/";
    document.getElementById("pseudo").innerHTML = "Welcome " + pseudo + " !";
  } else {
    document.getElementById("Compte").showModal();
  }
});

document.getElementById("btnconnecter").addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const pseudo = user.displayName;
      document.cookie = "pseudo=" + pseudo + "; path=/";
      document.cookie = "uid=" + user.uid + "; path=/";
      document.getElementById("pseudo").innerHTML = "Welcome " + pseudo + " !";
      document.getElementById("Compte").close();
    })
    .catch((error) => {
      const messageError = error.message;
      if (messageError == "Firebase: Error (auth/invalid-credential).") {
        alert("Identifiant ou addresse e-mail invalide.");
      } else if (messageError == "Firebase: Error (auth/invalid-email).") {
        alert("Veuillez remplir correctement votre addresse e-mail.");
      } else if (messageError == "Firebase: Error (auth/missing-password).") {
        alert("Veuillez remplir votre mot de passe.");
      } else {
        alert(messageError);
      }
    });
});

document.getElementById("btncreer").addEventListener("click", function () {
  const pseudo = document.getElementById("cpseudo").value;
  const email = document.getElementById("cemail").value;
  const password = document.getElementById("cpassword").value;
  if (pseudo == "") {
    alert("Veuillez remplir correctement votre pseudo.");
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: pseudo,
        })
          .then(() => {
            document.cookie = "pseudo=" + pseudo + "; path=/";
            document.cookie = "uid=" + auth.currentUser.uid + "; path=/";
            document.getElementById("pseudo").innerHTML =
              "Welcome " + pseudo + " !";
            document.getElementById("creercompte").close();
          })
          .catch((error) => {
            const messageError = error.message;
            alert(messageError);
          });
      })
      .catch((error) => {
        const messageError = error.message;
        if (messageError == "Firebase: Error (auth/invalid-credential).") {
          alert("Identifiant ou addresse e-mail invalide.");
        } else if (messageError == "Firebase: Error (auth/invalid-email).") {
          alert("Veuillez remplir correctement votre addresse e-mail.");
        } else if (messageError == "Firebase: Error (auth/missing-password).") {
          alert("Veuillez remplir votre mot de passe.");
        } else if (
          messageError == "Firebase: Error (auth/email-already-in-use)."
        ) {
          alert("Compte existant.");
        } else {
          alert(messageError);
        }
      });
  }
});

document.getElementById("liencreer").addEventListener("click", function () {
  document.getElementById("Compte").close();
  document.getElementById("creercompte").showModal();
});

document.getElementById("btnjouer").addEventListener("click", function () {
  window.location.href = "/src/salon.html";
});
/*
signInWithEmailAndPassword(auth, "pti.baub@gmail.com", "Cmoaaaa").then(
  (userCredential) => {
    const user = userCredential.user;
  }
);

function writeUserData(userId, name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, "Users/" + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
}

let idGame = 1;
let idPlayer = "Player1";
let x = 1;

function Play() {
  let play = true;
  while (play == true) {
    update(ref(db), { "Salon/1/Player1/x": x });
  }
}
*/
