// Importation de fonctions et variables depuis un autre fichier "labyrinthModel.js"
import {
  getLabyrinth,
  imgFantomeCerise,
  setAllGhostBleu,
} from "../models/labyrinthModel.js";
import { stopGameMusic } from '../app.js';
// Définition de la taille de chaque cellule dans la grille (en pixels)
const cellSize = 30;

// Exportation d'un tableau pour stocker les Pac-Gommes dans le labyrinthe
export let pacGommes = [];

// Définition des zones pour les grosses Pac-Gommes
const zones = [
  { a: 3, b: 1 }, // Coordonnées de la zone 1
  { a: 15, b: 1 }, // Coordonnées de la zone 2
  { a: 4, b: 48 }, // Coordonnées de la zone 3
  { a: 15, b: 48 }, // Coordonnées de la zone 4
  { a: 9, b: 12 }, // Coordonnées de la zone 5
];

// Création d'une image pour représenter les cœurs
const heartImage = new Image();
heartImage.src = "../assets/img/coeur.png"; // Chemin vers l'image des cœurs

// Fonction pour dessiner les cœurs représentant les vies du joueur
export function drawHearts(ctx, numHearts) {
  const heartWidth = 40; // Largeur de chaque cœur
  const heartHeight = 40; // Hauteur de chaque cœur
  const spacing = 5; // Espacement entre les cœurs

  // Calcul de la position de départ des cœurs (en bas à droite)
  const startX = ctx.canvas.width - numHearts * (heartWidth + spacing);
  const startY = ctx.canvas.height - heartHeight - 10;

  // Boucle pour dessiner chaque cœur
  for (let i = 0; i < numHearts; i++) {
    const x = startX + i * (heartWidth + spacing);
    ctx.drawImage(heartImage, x, startY, heartWidth, heartHeight); // Dessin de l'image du cœur
  }
}

// Fonction pour dessiner un mur avec un effet de dégradé
function drawBlockWall(ctx, x, y, width, height) {
  ctx.beginPath(); // Commencer un nouveau chemin pour dessiner
  ctx.rect(x, y, width, height); // Dessiner un rectangle de base

  // Créer un dégradé simulant une lumière
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, "#333333"); // Couleur sombre pour l'ombre
  gradient.addColorStop(0.5, "#888888"); // Couleur plus claire au centre
  gradient.addColorStop(1, "#333333"); // Retour à une couleur sombre

  ctx.fillStyle = gradient; // Appliquer le dégradé comme style de remplissage
  ctx.fill(); // Remplir le rectangle avec le style défini
}

// Fonction pour dessiner le labyrinthe avec des murs et des cases vides
export function drawLabyrinth(ctx, labyrinth, numHearts) {
  for (let row = 0; row < labyrinth.length; row++) {
    // Parcourir les lignes du labyrinthe
    for (let col = 0; col < labyrinth[row].length; col++) {
      // Parcourir les colonnes de chaque ligne
      const x = col * cellSize; // Calculer la position x de la cellule
      const y = row * cellSize; // Calculer la position y de la cellule

      if (labyrinth[row][col] === 1) {
        // Si la cellule est un mur
        drawBlockWall(ctx, x, y, cellSize, cellSize); // Dessiner un mur
      } else {
        // Sinon, dessiner une case vide en noir
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
  drawHearts(ctx, numHearts); // Dessiner les cœurs à la fin
}

// Initialiser les Pac-Gommes dans le labyrinthe
export function initPacGommes() {
  const labyrinth = getLabyrinth(); // Récupérer la structure du labyrinthe
  pacGommes = []; // Réinitialiser le tableau des Pac-Gommes

  // Parcourir chaque cellule du labyrinthe
  for (let row = 0; row < labyrinth.length; row++) {
    for (let col = 0; col < labyrinth[row].length; col++) {
      // Si la cellule est vide et ne fait pas partie des zones interdites
      if (
        labyrinth[row][col] === 0 &&
        (row < 4 || row > 11 || col < 29 || col > 36) &&
        (row < 6 || row > 10 || col < 0 || col > 4) &&
        (row < 6 || row > 10 || col < 45 || col > 50)
      ) {
        pacGommes.push({ x: col, y: row, type: "normal" }); // Ajouter une Pac-Gomme normale
      }
    }
  }

  // Ajouter les grosses Pac-Gommes aux zones définies
  zones.forEach((zone) => {
    if (labyrinth[zone.a] && labyrinth[zone.a][zone.b] === 0) {
      pacGommes.push({ x: zone.b, y: zone.a, type: "big" });
    }
  });

  // Ajouter une Pac-Gomme bonus
  pacGommes.push({ x: 33, y: 11, type: "bonus" });
}

// Variable pour compter les Pac-Gommes
let nbrPacGomme = 0;

// Fonction pour dessiner les Pac-Gommes dans le labyrinthe
export function drawPacGommes(ctx) {
  pacGommes.forEach((pacGomme) => {
    if (pacGomme.type === "bonus") {
      // Si c'est une Pac-Gomme bonus
      const bonusWidth = 60; // Largeur de l'image bonus
      const bonusHeight = 50; // Hauteur de l'image bonus
      const xCerise = 33 * cellSize + (cellSize - bonusWidth) / 2;
      const yCerise = 11 * cellSize + (cellSize - bonusHeight) / 2;

      let scores = document.getElementById("score").textContent; // Récupérer le score actuel
      const pointScore = parseInt(scores.split("=")[1].trim(), 10); // Extraire le score en nombre

      if (pointScore >= 500) {
        // Afficher la Pac-Gomme bonus si le score est suffisant
        ctx.drawImage(
          imgFantomeCerise,
          xCerise,
          yCerise,
          bonusWidth,
          bonusHeight
        );
      }
    } else {
      // Dessiner une Pac-Gomme normale ou grosse
      ctx.beginPath(); // Commencer un nouveau chemin
      ctx.arc(
        pacGomme.x * cellSize + cellSize / 2,
        pacGomme.y * cellSize + cellSize / 2,
        pacGomme.type === "big" ? 5 : 2, // Taille de la Pac-Gomme
        0,
        Math.PI * 2
      );
      ctx.fillStyle = pacGomme.type === "big" ? "red" : "yellow"; // Couleur selon le type
      ctx.fill(); // Dessiner la Pac-Gomme
      ctx.closePath();
      nbrPacGomme++; // Incrémenter le nombre de Pac-Gommes
    }
  });
}
let gameInterval;
// Déclare une variable pour stocker l'intervalle principal du jeu (utile pour arrêter les animations ou mises à jour).

function gameVictory() {
  // Fonction déclenchée lorsqu'une condition de victoire est atteinte.

  clearInterval(gameInterval);// Arrête l'intervalle principal du jeu pour stopper les mises à jour.

  // Supprimez le canvas ou cachez-le
  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.remove(); // Supprime complètement le canvas de la page
  }

  const overlay = document.createElement("div");
  // Crée une nouvelle div qui agira comme un écran sombre superposé.

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";
  // Définit les styles pour rendre l'écran sombre et centrer son contenu.

  const gameOverText = document.createElement("h1");
  // Crée un élément <h1> pour afficher le texte "VICTORY!".

  gameOverText.textContent = "VICTORY!";
  // Définit le contenu texte comme "VICTORY!" pour indiquer au joueur qu'il a gagné.

  gameOverText.style.color = "green";
  gameOverText.style.fontSize = "80px";
  gameOverText.style.marginBottom = "20px";
  // Applique des styles au texte de victoire.

  const restartText = document.createElement("p");
  // Crée un élément <p> pour afficher un message indiquant le retour au menu.

  restartText.textContent = "Returning to menu...";
  // Définit le contenu texte pour indiquer que le joueur sera redirigé.

  restartText.style.color = "white";
  restartText.style.fontSize = "24px";
  // Applique des styles au message de redirection.

  overlay.appendChild(gameOverText);
  overlay.appendChild(restartText);
  // Ajoute les deux messages (texte de victoire et redirection) à l'écran sombre.
  const gameVictorySound = new Audio("../assets/audio/pacman_intermission.wav");
  gameVictorySound.volume = 0.8;
  gameVictorySound.play();
  document.body.appendChild(overlay);
  // Ajoute l'écran sombre (overlay) à la page web.
  
  setTimeout(() => {
    window.location.href = "index.html";
    // Redirige l'utilisateur vers la page du menu principal après 3,5 secondes.
  }, 5000);
}

export let eatenPacGommesCount = 0;
// Variable qui suit le nombre de Pac-Gommes mangées par le joueur.

export let victoriCondition = false;
// Variable qui indique si la condition de victoire est atteinte.

let score = document.getElementById("score");
// Récupère l'élément HTML où le score sera affiché.

let essaie = document.getElementById("essaie");
// Récupère un élément HTML (probablement utilisé pour afficher un état de jeu).

let victory = document.getElementById("victory");
// Récupère un élément HTML (probablement pour afficher un message de victoire).
let victoryTriggered = false; // Variable pour vérifier si la victoire a déjà été déclenchée

// Fonction pour gérer les Pac-Gommes et appliquer les effets associés.
export function removeEatenPacGomme(pacmanPos) {
  function playSound(soundPath) {
    const audio = new Audio(soundPath);
    audio.play();
    // Joue un son à partir du chemin fourni (utilisé pour les sons d'effets).
  }

  pacGommes = pacGommes.filter((pacGomme) => {
    // Filtre les Pac-Gommes pour supprimer celles qui ont été mangées.

    const isEaten =
      pacGomme.x === pacmanPos.col && pacGomme.y === pacmanPos.row;
    // Vérifie si la Pac-Gomme est à la même position que Pac-Man.

    if (isEaten) {
      // Si la Pac-Gomme a été mangée, applique des effets spécifiques.

      if (pacGomme.type === "big") {
        // Si c'est une grosse Pac-Gomme :
        eatenPacGommesCount += 20;
        // Augmente le score de 20 points.

        setAllGhostBleu(true);
        // Rend les fantômes bleus, indiquant qu'ils peuvent être mangés.

        setTimeout(() => {
          setAllGhostBleu(false);
          // Après 10 secondes, réinitialise l'état des fantômes à leur couleur normale.
        }, 10000);
      } else if (pacGomme.type === "bonus") {
        // Si c'est une Pac-Gomme bonus :
        eatenPacGommesCount += 100;
        // Augmente le score de 100 points.

        playSound("../assets/audio/pacman_chomp.wav");
        // Joue un son spécifique pour la Pac-Gomme bonus.
      } else {
        // Pour une Pac-Gomme normale :
        eatenPacGommesCount += 10;
        // Augmente le score de 10 points.

        playSound("../assets/audio/pacman_chomp.wav");
        // Joue un son pour la Pac-Gomme normale.
      }
    }

    if (eatenPacGommesCount === 2620 && !victoryTriggered) {
      // Si toutes les Pac-Gommes ont été mangées (score maximum atteint) :
      victoriCondition = true;
      victoryTriggered = true;  // Marque la victoire comme déclenchée
      // Indique que la condition de victoire est remplie.

      gameVictory();
      stopGameMusic();
      // Appelle la fonction pour afficher l'écran de victoire.
    }

    score.innerHTML = `Score = ${eatenPacGommesCount}`;
    // Met à jour l'affichage du score dans l'interface utilisateur.

    return !isEaten;
    // Conserve uniquement les Pac-Gommes qui n'ont pas été mangées.
  });
}
