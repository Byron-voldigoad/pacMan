// import { dijkstraMoveGhost } from './pacmanController.js';
import {
  getLabyrinth,
  getAllGhostBleu,
  labyrinth,
} from "../models/labyrinthModel.js";
import { drawLabyrinth, drawPacGommes } from "../vues/labyrinthVue.js";
import { drawGhost, ghostPosition, redrawGame } from "../vues/fantomesVues.js";
import { drawPacman } from "../vues/pacmanVue.js";
import {
  pacman,
  resetPacmanPosition,
  live,
  lives,
} from "../models/pacmanModel.js";
import { checkCollisionWithGhosts } from "./pacmanController.js";
import {
  getGhostsPositions,
  resetGhostsPositions,
} from "../models/fantomesModel.js";
import { stopGameMusic } from '../app.js';

const position = getGhostsPositions();
const possitionFantomeRouge = position.rouge;
const possitionFantomeRose = position.rose;
const possitionFantomeBleu = position.bleu;
const possitionFantomeOrange = position.orange;
const possitionFantomeCerise = position.cerise;

// Déplacement aléatoire du fantôme
export function getRandomDirection() {
  const directions = ["up", "down", "left", "right"];
  return directions[Math.floor(Math.random() * directions.length)];
}

let gameInterval; // Variable pour stocker le setInterval

function gameOver() {
  // Arrêter les mouvements et nettoyez les intervalles
  clearInterval(gameInterval);

  // Supprimez le canvas ou cachez-le
  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.remove(); // Supprime complètement le canvas de la page
  }

  // Créez un écran sombre
  const overlay = document.createElement("div");
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

  // Ajouter le message "Game Over"
  const gameOverText = document.createElement("h1");
  gameOverText.textContent = "Game Over!";
  gameOverText.style.color = "red";
  gameOverText.style.fontSize = "48px";
  gameOverText.style.marginBottom = "20px";

  // Ajouter le texte pour la redirection
  const restartText = document.createElement("p");
  restartText.textContent = "Returning to menu...";
  restartText.style.color = "white";
  restartText.style.fontSize = "24px";

  overlay.appendChild(gameOverText);
  overlay.appendChild(restartText);
  document.body.appendChild(overlay);
  const gameOverSound = new Audio("../assets/audio/game-over-arcade-6435.mp3");
  gameOverSound.play();
  // Redirection vers le menu après 3 secondes
  setTimeout(() => {
    window.location.href = "index.html";
  }, 4000);
}

const cellSize = 30;
export let isPacmanDead = false; // Suivi de l'état de Pac-Man

function simulatePacmanDeath(ctx) {
  const pacmanPosition = pacman; // Position actuelle de Pac-Man
  const centerX = pacmanPosition.col * cellSize + cellSize / 2;
  const centerY = pacmanPosition.row * cellSize + cellSize / 2;

  let radius = cellSize / 2;

  const deathInterval = setInterval(() => {
    ctx.clearRect(
      centerX - cellSize,
      centerY - cellSize,
      cellSize * 2,
      cellSize * 2
    );
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    radius -= 2; // Réduire le rayon progressivement

    if (radius <= 0) {
      clearInterval(deathInterval); // Stopper l'animation
    }
  }, 50);
}

function kill(ctx) {
  // Vérifier si Pac-Man est déjà "mort" pour éviter plusieurs exécutions
  if (isPacmanDead) return;

  if (checkCollisionWithGhosts(pacman, ghostPosition)) {
    isPacmanDead = true; // Marquer Pac-Man comme mort

    let countLive = live();

    const deadinterval = setInterval(() => {
      // Simuler la mort de Pac-Man
      // simulatePacmanDeath(ctx);
    }, 500);
    // Réinitialiser les positions des fantômes
    resetGhostsPositions();
    const gameOverSound = new Audio("../assets/audio/pacman_death.wav");
    gameOverSound.play();
    // Ajouter un délai avant de réinitialiser les positions
    setTimeout(() => {
      resetPacmanPosition(); // Réinitialiser Pac-Man

      // Redessiner le jeu après la réinitialisation
      redrawGame(ctx);

      // Reprendre le jeu si le joueur a encore des vies
      if (countLive > 0) {
        gameInterval = setInterval(() => {
          // startGhostMovement(ctx);
        }, 100); // Reprendre le jeu avec une boucle d'intervalle
      } else {
        gameOver(ctx); // Appeler Game Over si le joueur n'a plus de vies
        stopGameMusic();
      }
      isPacmanDead = false; // Marquer Pac-Man comme vivant
      clearInterval(deadinterval);
    }, 3000); // Délai de 3 secondes
  }
}

function isValidMove(labyrinth, row, col) {
  return (
    row >= 0 &&
    col >= 0 &&
    row < labyrinth.length &&
    col < labyrinth[0].length &&
    labyrinth[row][col] === 0
  ); // 0 est un espace vide dans le labyrinthe
}

/*  Etape 1 : le pacman est la proie ******************************************* */

export function dijkstraMoveGhost(ctx, ghostPosition, targetPosition) {
  const labyrinth = getLabyrinth();
  const rows = labyrinth.length;
  const cols = labyrinth[0].length;

  const ghostRow = Math.floor(ghostPosition.row);
  const ghostCol = Math.floor(ghostPosition.col);

  const pacmanRow = Math.floor(targetPosition.row);
  const pacmanCol = Math.floor(targetPosition.col);

  // Initialisation des structures de données
  const distances = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
  const previous = Array.from({ length: rows }, () => Array(cols).fill(null));
  const queue = [];

  // Définir le point de départ (fantôme)
  distances[ghostRow][ghostCol] = 0;
  queue.push({ row: ghostRow, col: ghostCol, distance: 0 });

  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 }, // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }, // right
  ];

  // Algorithme de Dijkstra
  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const { row, col, distance } = queue.shift();

    // Si on atteint Pac-Man, arrêter la recherche
    if (row === pacmanRow && col === pacmanCol) {
      kill(ctx);
    }

    for (const direction of directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      if (isValidMove(labyrinth, newRow, newCol)) {
        const newDistance = distance + 1;
        if (newDistance < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDistance;
          previous[newRow][newCol] = { row, col };
          queue.push({ row: newRow, col: newCol, distance: newDistance });
        }
      }
    }
  }

  // Reconstituer le chemin vers Pac-Man
  let path = [];
  let current = { row: pacmanRow, col: pacmanCol };

  while (current && previous[current.row][current.col]) {
    path.push(current);
    current = previous[current.row][current.col];
  }

  path = path.reverse();

  // Retourner le premier mouvement
  return path.length > 0 ? path[0] : null;
}

export function dijkstraMoveRedGhost(ctx) {
  const ghostRow = Math.floor(possitionFantomeRouge.row);
  const ghostCol = Math.floor(possitionFantomeRouge.col);
  const ghostPosition = { row: ghostRow, col: ghostCol };

  // console.log(possitionFantomeRouge);

  // console.log(ghostPosition);

  const pacmanRow = Math.floor(pacman.row);
  const pacmanCol = Math.floor(pacman.col);
  const targetPosition = { row: pacmanRow, col: pacmanCol };

  // console.log("Position actuelle du fantôme rouge :", ghostPosition);

  const nextMove = dijkstraMoveGhost(ctx, ghostPosition, targetPosition);

  if (nextMove) {
    possitionFantomeRouge.row = nextMove.row;
    possitionFantomeRouge.col = nextMove.col;
    // console.log("Fantôme rouge déplacé à :", nextMove);
  } else {
    // console.log("Aucun chemin valide trouvé pour le fantôme rouge.");
  }
}

export function dijkstraMovePinkGhost(ctx) {
  const labyrinth = getLabyrinth();
  const rows = labyrinth.length;
  const cols = labyrinth[0].length;

  const ghostRow = Math.floor(possitionFantomeRose.row);
  const ghostCol = Math.floor(possitionFantomeRose.col);

  // Position actuelle de Pac-Man
  let targetRow = Math.floor(pacman.row);
  let targetCol = Math.floor(pacman.col);

  // Vérification des cases devant Pac-Man
  const maxAnticipationDistance = 3;
  let validTargetFound = false;

  for (let i = maxAnticipationDistance; i >= 0; i--) {
    let anticipatedRow = targetRow;
    let anticipatedCol = targetCol;

    switch (pacman.direction) {
      case "up":
        anticipatedRow -= i;
        break;
      case "down":
        anticipatedRow += i;
        break;
      case "left":
        anticipatedCol -= i;
        break;
      case "right":
        anticipatedCol += i;
        break;
    }

    // Assurer que la cible reste dans les limites et vérifier si la case est valide
    if (
      anticipatedRow >= 0 &&
      anticipatedRow < rows &&
      anticipatedCol >= 0 &&
      anticipatedCol < cols &&
      labyrinth[anticipatedRow][anticipatedCol] === 0 // Vérifie si c'est une case vide
    ) {
      targetRow = anticipatedRow;
      targetCol = anticipatedCol;
      validTargetFound = true;
      break; // On a trouvé une cible valide
    }
  }

  // Si aucune case valide n'est trouvée, Pinky suit Pac-Man directement
  if (!validTargetFound) {
    targetRow = Math.floor(pacman.row);
    targetCol = Math.floor(pacman.col);
  }

  // Initialisation pour BFS
  const queue = [{ row: ghostRow, col: ghostCol }];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const previous = Array.from({ length: rows }, () => Array(cols).fill(null));

  visited[ghostRow][ghostCol] = true;

  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 }, // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }, // right
  ];

  // BFS pour trouver le chemin vers la cible
  while (queue.length > 0) {
    const current = queue.shift();
    const { row, col } = current;

    // Si on atteint la cible, arrêter
    if (row === targetRow && col === targetCol) {
      kill(ctx);
    }

    for (const direction of directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        labyrinth[newRow][newCol] === 0 && // Assurer que c'est une case vide
        !visited[newRow][newCol]
      ) {
        visited[newRow][newCol] = true;
        previous[newRow][newCol] = { row, col };
        queue.push({ row: newRow, col: newCol });
      }
    }
  }

  // Reconstituer le chemin
  let path = [];
  let current = { row: targetRow, col: targetCol };

  while (current && previous[current.row][current.col]) {
    path.push(current);
    current = previous[current.row][current.col];
  }

  path = path.reverse();

  // Effectuer le premier mouvement du chemin
  if (path.length > 0) {
    const nextMove = path[0];
    possitionFantomeRose.row = nextMove.row;
    possitionFantomeRose.col = nextMove.col;
    // console.log(`Pinky se déplace vers (${nextMove.row}, ${nextMove.col})`);
  } else {
    // Si aucun chemin valide n'est trouvé, Pinky choisit un point aléatoire comme nouvelle cible
  }
}

let previousRandomPoint = null; // Variable pour stocker le point précédent

function generateRandomPointAroundPacman() {
  const labyrinth = getLabyrinth(); // Récupérer le labyrinthe
  const rows = labyrinth.length; // Nombre de lignes dans le labyrinthe
  const cols = labyrinth[0].length; // Nombre de colonnes dans le labyrinthe

  // Récupérer la position de Pac-Man
  const pacmanRow = Math.floor(pacman.row);
  const pacmanCol = Math.floor(pacman.col);

  // Définir la plage du rayon de 5 cases autour de Pac-Man
  const minRow = Math.max(pacmanRow - 5, 0); // Limiter la plage en haut
  const maxRow = Math.min(pacmanRow + 5, rows - 1); // Limiter la plage en bas
  const minCol = Math.max(pacmanCol - 5, 0); // Limiter la plage à gauche
  const maxCol = Math.min(pacmanCol + 5, cols - 1); // Limiter la plage à droite

  // Si c'est la première génération ou si le point précédent a été atteint
  if (
    !previousRandomPoint ||
    (previousRandomPoint.row === possitionFantomeBleu.row &&
      previousRandomPoint.col === possitionFantomeBleu.col)
  ) {
    // Générer un point aléatoire dans le rayon autour de Pac-Man
    let randomRow, randomCol;
    do {
      randomRow = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
      randomCol = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;
    } while (!isValidMove(labyrinth, randomRow, randomCol)); // Vérifier que le point généré est valide

    // Mettre à jour le point précédent
    previousRandomPoint = { row: randomRow, col: randomCol };
  }

  // Retourner la position générée
  return previousRandomPoint;
}

export function MoveBlueGhost(ctx) {
  // Générer ou obtenir le point à atteindre (si nécessaire)
  const randomPoint = generateRandomPointAroundPacman();
  // console.log("La cible du Fantôme bleu est :", randomPoint);

  // Déplacer le fantôme bleu vers ce point avec l'algorithme de Dijkstra
  const nextMove = dijkstraMoveGhost(ctx, possitionFantomeBleu, randomPoint);

  if (nextMove) {
    possitionFantomeBleu.row = nextMove.row;
    possitionFantomeBleu.col = nextMove.col;
    // console.log("Fantôme bleu déplacé à :", nextMove);

    // Vérifier si le fantôme a atteint le point
    if (
      possitionFantomeBleu.row === randomPoint.row &&
      possitionFantomeBleu.col === randomPoint.col
    ) {
      // console.log("Fantôme bleu a atteint son objectif, génération d'un nouveau point.");
      previousRandomPoint = null; // Réinitialiser pour générer un nouveau point
    }
  } else {
    // console.log("Aucun chemin valide trouvé pour le fantôme bleu.");
  }
}
let previousRandomPointOrange;

export function MoveOrangeGhost(ctx) {
  const randomPoint = generateRandomPointAroundPacman();
  // console.log("La cible du Fantôme orange est :", randomPoint);

  const nextMove = dijkstraMoveGhost(ctx, possitionFantomeOrange, randomPoint);
  if (nextMove) {
    possitionFantomeOrange.row = nextMove.row;
    possitionFantomeOrange.col = nextMove.col;
    // console.log("Fantôme orange déplacé à :", nextMove);

    // Vérifier si le fantôme a atteint le point
    if (
      possitionFantomeOrange.row === randomPoint.row &&
      possitionFantomeOrange.col === randomPoint.col
    ) {
      // console.log("Fantôme orange a atteint son objectif, génération d'un nouveau point.");
      previousRandomPointOrange = null; // Réinitialiser pour générer un nouveau point
    }
  } else {
    previousRandomPointOrange = null;
    // console.log("Aucun chemin valide trouvé pour le fantôme orange.");
  }
}
//********************************************************************************************************************* */

/* Etape 2 : les fantomes sont les proies */

function moveGhostAwayFromPacman(ghostPos, pacmanPos, labyrinth) {
  const directions = [
    { row: -1, col: 0, dir: "up" }, // Haut
    { row: 1, col: 0, dir: "down" }, // Bas
    { row: 0, col: -1, dir: "left" }, // Gauche
    { row: 0, col: 1, dir: "right" }, // Droite
  ];

  let maxDistance = -Infinity; // Pour trouver la direction qui maximise la distance
  let bestMove = null;

  directions.forEach((direction) => {
    const newRow = ghostPos.row + direction.row;
    const newCol = ghostPos.col + direction.col;

    // Vérifiez si la case est valide et libre (pas un mur dans le labyrinthe)
    if (labyrinth[newRow] && labyrinth[newRow][newCol] === 0) {
      if (newRow === pacmanPos.row && newCol === pacmanPos.col) {
        // kill(ctx); // Appelle la fonction pour tuer Pac-Man
        console.log("Mort du fantome :",ghostPos);
        
      }
      const distance =
        Math.abs(newRow - pacmanPos.row) + Math.abs(newCol - pacmanPos.col);
      if (distance > maxDistance) {
        maxDistance = distance;
        bestMove = { row: newRow, col: newCol };
      }
      
    }
  });

  // Retourne la meilleure position pour le fantôme
  return bestMove || ghostPos; // Si aucune direction valide, reste sur place
}

export function MoveGhostAwayGhost(ctx, possitionFantome) {
  let labyrinth = getLabyrinth();
  // Déplacer le fantôme bleu pour fuir Pac-Man
  const nextMove = moveGhostAwayFromPacman(possitionFantome, pacman, labyrinth);
  if (nextMove) {
    possitionFantome.row = nextMove.row;
    possitionFantome.col = nextMove.col;
  }
}

/*************************************************************************************************************/

export function ghostMoves(ctx) {
  let azerty = essaie.value === "true"; // Convertit la chaîne en booléen
  if (azerty) {
    // Déplacer chaque fantôme pour fuir Pac-Man
    MoveGhostAwayGhost(ctx, possitionFantomeBleu);
    MoveGhostAwayGhost(ctx, possitionFantomeRouge);
    MoveGhostAwayGhost(ctx, possitionFantomeRose);
    MoveGhostAwayGhost(ctx, possitionFantomeOrange);
  } else {
    if (isPacmanDead) {
      console.log("pacman mort");
    } else {
      dijkstraMoveRedGhost(ctx);
      dijkstraMovePinkGhost(ctx);
      MoveBlueGhost(ctx);
      MoveOrangeGhost(ctx);
    }
  }
}

let intervalId; // Déclaré à un niveau supérieur pour persister à travers les appels
let essaie = document.getElementById("essaie");

// Fonction pour démarrer ou arrêter les mouvements des fantômes en fonction de AllGhostBleu
export function startGhostMovement(ctx) {
  const moveInterval = 500; // Intervalle de déplacement des fantômes

  intervalId = setInterval(() => {
    // Déplace chaque fantôme
    ghostMoves(ctx);

    // Redessine tout le labyrinthe après les déplacements
    const labyrinth = getLabyrinth();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawLabyrinth(ctx, labyrinth, lives);
    drawPacGommes(ctx);
    drawPacman(ctx, pacman);
    drawGhost(ctx); // Redessiner les fantômes
  }, moveInterval);
}
