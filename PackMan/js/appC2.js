import { getLabyrinth } from './models/labyrinthModel.js';
import { pacman } from './models/pacmanModel.js';
import { drawLabyrinth } from './vues/labyrinthVue.js';
import { drawPacman } from './vues/pacmanVue.js';
import { startGhostMovement } from './controllers/fantomeController.js';
import { initPacGommes, drawPacGommes } from './vues/labyrinthVue.js';
import { handleMovement } from './controllers/pacmanController.js';

// Musiques
let menuMusic = new Audio('../audio/DAN_DA_DAN_Opening___Otonoke_by_Creepy_Nuts(256k).mp3');  // Musique du menu
let waitMusic = new Audio('../audio/Creepy_nuts_-_Otonoke__Dandadan_Op__Ringtone(256k).mp3'); // Musique d'attente
let gameMusicOP = new Audio('../audio/One_Punch_Man_OST_-1080p-_Seigi_Shikkou_(Original)(256k).mp3'); // Musique du jeu
let gameMusic = new Audio('../audio/Naruto_Shippuden_OST_1_-_Track_02_-_Douten_(_Heaven_Shaking_Event_)(256k).mp3'); // Musique du jeu


// Fonction pour jouer un son
function playSound(soundPath) {
  const audio = new Audio(soundPath);
  audio.play();
}

// Fonction pour appliquer un dégradé au volume de la musique
function fadeOut(audio, duration) {
  const fadeInterval = 50; // Intervalle de mise à jour en ms
  const fadeStep = 1 / (duration / fadeInterval); // Calcul du dégradé à appliquer

  let volume = audio.volume; // Récupère le volume actuel

  const fade = setInterval(() => {
    volume -= fadeStep; // Diminue le volume
    if (volume <= 0) {
      clearInterval(fade); // Arrête l'intervalle quand le volume atteint 0
      audio.pause();       // Arrête la musique
      audio.currentTime = 0; // Remet la musique au début
    } else {
      audio.volume = volume; // Applique le nouveau volume
    }
  }, fadeInterval);
}

// Initialisation du jeu
const canvas = document.getElementById("monCanvas");
const ctx = canvas.getContext("2d");

export function initializeGame() {
  drawLabyrinth(ctx, getLabyrinth());
  initPacGommes();
  drawPacGommes(ctx);
  drawPacman(ctx, pacman);
  startGhostMovement(ctx);
  
  // Assure-toi d'arrêter toutes les musiques avant de commencer la musique du jeu
  menuMusic.pause();
  waitMusic.pause();
  gameMusic.loop = true; // Mise en boucle de la musique du jeu
  gameMusic.play(); // Démarre la musique du jeu
  
}

// Gestion des événements
window.addEventListener("keydown", (event) => handleMovement(event, ctx));

// Ajouter un délai avant de commencer le jeu
window.onload = () => {
  const startScreen = document.getElementById("start-screen");
  const canvas = document.getElementById("monCanvas");

  // Joue la musique d'attente pendant 6 secondes
  waitMusic.loop = true;
  menuMusic.pause();
  waitMusic.play(); // Joue la musique d'attente
  
  // Affiche l'écran de démarrage pendant 6 secondes
  setTimeout(() => {
    startScreen.style.display = "none"; // Masque l'écran de démarrage
    canvas.style.display = "block";     // Affiche le canvas du jeu
    waitMusic.pause();                  // Arrête la musique d'attente
    waitMusic.currentTime = 0;          // Remet la musique d'attente au début
    initializeGame();                   // Démarre le jeu
  }, 6000); // Délai de 6 secondes avant de démarrer le jeu
};

// Applique le dégradé de volume pour la musique d'attente
fadeOut(waitMusic, 6000); // Diminue le volume de `waitMusic` sur 6 secondes



// Quand la page (index.html) est chargée
// Initialisation de la musique du menu avant le démarrage du jeu
menuMusic.loop = true; 
menuMusic.play();
