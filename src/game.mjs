import "./game.css";
import { Niveaux } from "./Niveaux.mjs";
const niveau = Niveaux[1];

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

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

const data = new URL(window.location);
const uidGame = data.searchParams.get("uidGame");
const numPlayer = data.searchParams.get("numPlayer");
let numAdversaire = 0;
if (numPlayer == "1") {
  numAdversaire = 2;
} else {
  numAdversaire = 1;
}

const canvas1 = document.getElementById("joueur1");
const ctx1 = canvas1.getContext("2d");
const canvas2 = document.getElementById("joueur2");
const ctx2 = canvas2.getContext("2d");

const player = new Image();
player.src = "./player.png";
const mur = new Image();
mur.src = "./mur.png";
const sol = new Image();
sol.src = "./sol.png";
const eau = new Image();
eau.src = "./eau.png";
let yplayer = 400;
let x = 0;
let y1 = 0;
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

function quot(dividende, diviseur) {
  let quotient = (dividende - (dividende % diviseur)) / diviseur;
  return quotient;
}

function drawNiveau(ctx, y) {
  for (let yp = 0; yp < 6; yp++) {
    for (let xp = 0; xp < 5; xp++) {
      if (niveau[quot(y, 100) + yp][xp] == 1) {
        ctx.drawImage(
          mur,
          xp * 100,
          (yp * 100 - (y % 100)) * -1 + 400,
          100,
          100
        );
      } else if (niveau[quot(y, 100) + yp][xp] == 0) {
        ctx.drawImage(
          sol,
          xp * 100,
          (yp * 100 - (y % 100)) * -1 + 400,
          100,
          100
        );
      } else {
        ctx.drawImage(
          eau,
          xp * 100,
          (yp * 100 - (y % 100)) * -1 + 400,
          100,
          100
        );
      }
    }
  }
}

function drawAdversaire(yAdversaire, y2, x2) {
  ctx2.clearRect(0, 0, 500, 500);
  drawNiveau(ctx2, y2);
  ctx2.drawImage(player, x2, yAdversaire, 75, 75);
}

function draw() {
  ctx1.clearRect(0, 0, 500, 500);
  drawNiveau(ctx1, y1);
  ctx1.drawImage(player, x, yplayer, 75, 75);
}

function movePlayer() {
  if (y1 > 1000) {
    playing = false;
  }
  if (rightPressed) {
    x += 2;
    draw();
  }
  if (leftPressed) {
    x -= 2;
    draw();
  }
  if (upPressed) {
    if (yplayer > 250) {
      yplayer -= 2;
    } else {
      y1 += 2;
    }
    draw();
  }
  if (downPressed) {
    if (yplayer < 400) {
      yplayer += 2;
    } else {
      y1 -= 2;
    }
    draw();
  }
  writeCoordinate();
}

document.addEventListener("keyup", function (event) {
  if (event.key == "ArrowRight") {
    rightPressed = false;
  } else if (event.key == "ArrowLeft") {
    leftPressed = false;
  } else if (event.key == "ArrowUp") {
    upPressed = false;
  } else if (event.key == "ArrowDown") {
    downPressed = false;
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key == "ArrowRight") {
    rightPressed = true;
  } else if (event.key == "ArrowLeft") {
    leftPressed = true;
  } else if (event.key == "ArrowUp") {
    upPressed = true;
  } else if (event.key == "ArrowDown") {
    downPressed = true;
  }
});

onValue(ref(db, "Salon/" + uidGame + "/Player" + numAdversaire), (data) => {
  let adversaire = data.val();
  let x2 = adversaire["x"];
  let y2 = adversaire["y"];
  let yAdversaire = adversaire["yplayer"];
  drawAdversaire(yAdversaire, y2, x2);
});

function writeCoordinate() {
  let coordinate = {};
  coordinate["x"] = x;
  coordinate["y"] = y1;
  coordinate["yplayer"] = yplayer;
  update(ref(db, "Salon/" + uidGame + "/Player" + numPlayer), coordinate);
}

setInterval(movePlayer, 20);
