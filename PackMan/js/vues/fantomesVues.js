// Importation des fonctions et variables nécessaires depuis d'autres modules
import { getGhostsPositions, imgFantomeCerise, resetGhostsPositions, imgFantomePeur, imgFantomeRouge, imgFantomeRose, imgFantomeBleu, imgFantomeOrange } from "../models/fantomesModel.js";
import { drawLabyrinth, drawPacGommes, removeEatenPacGomme } from '../vues/labyrinthVue.js';
import { getLabyrinth } from '../models/labyrinthModel.js';

// Définition de la taille d'une cellule de la grille (chaque case du labyrinthe mesurera 30 pixels)
const cellSize = 30;

// Appel de la fonction pour récupérer les positions actuelles des fantômes
const position = getGhostsPositions(); // La fonction retourne les positions initiales des fantômes.

// Récupération des positions individuelles des fantômes à partir de l'objet `position`
const possitionFantomeRouge = position.rouge; // Position du fantôme rouge
const possitionFantomeRose = position.rose; // Position du fantôme rose
const possitionFantomeBleu = position.bleu; // Position du fantôme bleu
const possitionFantomeOrange = position.orange; // Position du fantôme orange
const possitionFantomeCerise = position.cerise; // Position du fantôme cerise

// Fonction pour dessiner les fantômes sur le canvas
export function drawGhost(ctx) {
  // Détermine si les fantômes doivent être affichés en mode "peur" ou normal
  let azerty = essaie.value === "true"; // Vérifie l'état de `essaie.value` et le convertit en booléen.
  let ghostWidth = 60; // Définit la largeur par défaut des fantômes.
  let ghostHeight = 50; // Définit la hauteur par défaut des fantômes.

  if (azerty) {
    // Si les fantômes sont en mode "peur", réduisez leur taille
    ghostWidth = 40;
    ghostHeight = 30;
  }

  // Calcul de la position pour centrer chaque fantôme dans sa cellule
  const x = possitionFantomeRouge.col * cellSize + (cellSize - ghostWidth) / 2; // Position X du fantôme rouge
  const y = possitionFantomeRouge.row * cellSize + (cellSize - ghostHeight) / 2; // Position Y du fantôme rouge

  const xRose = possitionFantomeRose.col * cellSize + (cellSize - ghostWidth) / 2; // Position X du fantôme rose
  const yRose = possitionFantomeRose.row * cellSize + (cellSize - ghostHeight) / 2; // Position Y du fantôme rose

  const xBleu = possitionFantomeBleu.col * cellSize + (cellSize - ghostWidth) / 2; // Position X du fantôme bleu
  const yBleu = possitionFantomeBleu.row * cellSize + (cellSize - ghostHeight) / 2; // Position Y du fantôme bleu

  const xOrange = possitionFantomeOrange.col * cellSize + (cellSize - ghostWidth) / 2; // Position X du fantôme orange
  const yOrange = possitionFantomeOrange.row * cellSize + (cellSize - ghostHeight) / 2; // Position Y du fantôme orange

  // Dessiner les fantômes
  if (azerty) {
    // Si le mode "peur" est activé, dessinez les fantômes avec une image spéciale
    const ghostWidth = 50;
    const ghostHeight = 40;

    ctx.drawImage(imgFantomePeur, x, y, ghostWidth, ghostHeight); // Fantôme rouge en mode peur
    ctx.drawImage(imgFantomePeur, xRose, yRose, ghostWidth, ghostHeight); // Fantôme rose en mode peur
    ctx.drawImage(imgFantomePeur, xBleu, yBleu, ghostWidth, ghostHeight); // Fantôme bleu en mode peur
    ctx.drawImage(imgFantomePeur, xOrange, yOrange, ghostWidth, ghostHeight); // Fantôme orange en mode peur
  } else {
    // Sinon, dessinez les fantômes normalement
    ctx.drawImage(imgFantomeRouge, x, y, ghostWidth, ghostHeight); // Fantôme rouge
    ctx.drawImage(imgFantomeRose, xRose, yRose, ghostWidth, ghostHeight); // Fantôme rose
    ctx.drawImage(imgFantomeBleu, xBleu, yBleu, ghostWidth, ghostHeight); // Fantôme bleu
    ctx.drawImage(imgFantomeOrange, xOrange, yOrange, ghostWidth, ghostHeight); // Fantôme orange
  }
}

// Fonction pour redessiner le jeu entier, en réinitialisant les positions des fantômes
export function redrawGame(ctx) {
  resetGhostsPositions(); // Réinitialise les positions des fantômes
  console.log(resetGhostsPositions()); // Affiche les nouvelles positions des fantômes dans la console

  let ghostWidth = 60; // Largeur par défaut des fantômes
  let ghostHeight = 50; // Hauteur par défaut des fantômes

  // Calcul des positions recalculées pour chaque fantôme
  const x = possitionFantomeRouge.col * cellSize + (cellSize - ghostWidth) / 2;
  const y = possitionFantomeRouge.row * cellSize + (cellSize - ghostHeight) / 2;

  const xRose = possitionFantomeRose.col * cellSize + (cellSize - ghostWidth) / 2;
  const yRose = possitionFantomeRose.row * cellSize + (cellSize - ghostHeight) / 2;

  const xBleu = possitionFantomeBleu.col * cellSize + (cellSize - ghostWidth) / 2;
  const yBleu = possitionFantomeBleu.row * cellSize + (cellSize - ghostHeight) / 2;

  const xOrange = possitionFantomeOrange.col * cellSize + (cellSize - ghostWidth) / 2;
  const yOrange = possitionFantomeOrange.row * cellSize + (cellSize - ghostHeight) / 2;

  // Dessiner les fantômes avec leurs nouvelles positions
  ctx.drawImage(imgFantomeRouge, x, y, ghostWidth, ghostHeight);
  ctx.drawImage(imgFantomeRose, xRose, yRose, ghostWidth, ghostHeight);
  ctx.drawImage(imgFantomeBleu, xBleu, yBleu, ghostWidth, ghostHeight);
  ctx.drawImage(imgFantomeOrange, xOrange, yOrange, ghostWidth, ghostHeight);

  console.log("Fantômes redessinés avec succès !");
}

// Tableau exporté contenant les positions actuelles des fantômes
export const ghostPosition = [possitionFantomeRouge, possitionFantomeRose, possitionFantomeBleu, possitionFantomeOrange];
