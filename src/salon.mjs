import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

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

function readCookie(name) {
  const cookie = decodeURIComponent(document.cookie).split("; ");
  for (let i in cookie) {
    if (cookie[i].includes(name)) {
      const split = cookie[i].split("=");
      return split[1];
    }
  }
}

const pseudo = readCookie("pseudo");
const uid = readCookie("uid");
const player = { x: 0, y: 0, Pseudo: pseudo, yplayer: 0 };

get(child(ref(db), "Salon"))
  .then((Salon) => {
    const salons = Salon.val();
    if (salons == null) {
      let nouvPart = document.createElement("p");
      nouvPart.innerHTML = "Aucune partie disponible.";
      document.getElementById("test").appendChild(nouvPart);
    } else {
      for (let i in salons) {
        if (Object.keys(salons[i]).length == 1) {
          let nouvPart = document.createElement("p");
          nouvPart.innerHTML = i;
          nouvPart.id = "partie";
          nouvPart.addEventListener("click", function () {
            const uidGame = nouvPart.innerHTML;
            set(ref(db, "Salon/" + uidGame + "/Player2"), {
              Pseudo: pseudo,
              x: 0,
              y: 0,
              yplayer: 0,
            });
            window.location.href =
              "./game.html?uidGame=" + uidGame + "&numPlayer=2";
          });
          document.getElementById("test").appendChild(nouvPart);
        }
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });

document.getElementById("creerpartie").addEventListener("click", function () {
  set(ref(db, "Salon/" + uid), {
    Player1: player,
  });
  document.getElementById("attPers").showModal();
  onValue(ref(db, "Salon/" + uid), (data) => {
    const game = data.val();
    if (Object.keys(game).length == 2) {
      window.location.href = "./game.html?uidGame=" + uid + "&numPlayer=1";
    }
  });
});
