import { getLabyrinth } from "../models/labyrinthModel.js";
import {
  pacman,
  resetPacmanPosition,
  lives,
} from "../models/pacmanModel.js";
import { drawPacman, animatePacmanMouth } from "../vues/pacmanVue.js";
import { drawGhost, ghostPosition, redrawGame } from "../vues/fantomesVues.js";
import { resetGhostsPositions } from "../models/fantomesModel.js";
import { isPacmanDead } from "./fantomeController.js";
import {
  drawLabyrinth,
  drawPacGommes,
  removeEatenPacGomme,
  victoriCondition,
} from "../vues/labyrinthVue.js";

function playSound(soundPath) {
  const audio = new Audio(soundPath);
  audio.play();
}

function interpolate(start, end, progress) {
  return start + (end - start) * progress;
}

function animateMovement(
  entity,
  startRow,
  startCol,
  endRow,
  endCol,
  duration,
  drawFunction
) {
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Clamp le progress à [0, 1]

    const currentRow = interpolate(startRow, endRow, progress);
    const currentCol = interpolate(startCol, endCol, progress);

    // Mets à jour la position de l'entité pour l'animation
    entity.row = currentRow;
    entity.col = currentCol;

    // Redessine l'entité
    drawFunction();

    // Continue l'animation tant qu'elle n'est pas terminée
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Arrêter sur la position finale pour éviter les écarts
      entity.row = endRow;
      entity.col = endCol;
      drawFunction();
      // console.log("Animation ended");
    }
  }

  requestAnimationFrame(animate);
}

export function checkCollisionWithGhosts(pacman, ghostPosition) {
  return ghostPosition.some(
    (ghost) => ghost.row === pacman.row && ghost.col === pacman.col
  );
}

function movePacman(newRow, newCol, ctx) {
  const oldRow = pacman.row;
  const oldCol = pacman.col;

  // Lancer l'animation
  animateMovement(
    pacman,
    oldRow,
    oldCol,
    newRow,
    newCol,
    400, // Durée de l'animation en ms
    () => {
      animatePacmanMouth();
      removeEatenPacGomme({ row: newRow, col: newCol });
      if (pacman.col === 49 && pacman.row === 8) {
        pacman.col = 1; // Téléporter
        playSound("../assets/audio/dragon_ball_z_tele.mp3");
        // console.log("Pac-Man téléporté à (1, 8)");
      } else if (pacman.col === 0 && pacman.row === 8) {
        pacman.col = 48; // Téléporter
        playSound("../assets/audio/dragon_ball_z_tele.mp3");
        // console.log("Pac-Man téléporté à (48, 8)");
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawLabyrinth(ctx, getLabyrinth(), lives);
      drawPacGommes(ctx);
      drawPacman(ctx, pacman); // Redessiner Pac-Man à sa position interpolée
      
      drawGhost(ctx); // Redessiner le fantôme
      
    }
  );
}

export function handleMovement(event, ctx) {
  const labyrinth = getLabyrinth();
  let newRow = pacman.row;
  let newCol = pacman.col;

  switch (event.key) {
    case "ArrowUp":
      newRow -= 1;
      pacman.direction = "up";
      break;
    case "ArrowDown":
      newRow += 1;
      pacman.direction = "down";
      break;
    case "ArrowLeft":
      newCol -= 1;
      pacman.direction = "left";
      break;
    case "ArrowRight":
      newCol += 1;
      pacman.direction = "right";
      break;
  }

  if (labyrinth[newRow] && labyrinth[newRow][newCol] === 0 && !isPacmanDead && !checkCollisionWithGhosts(pacman, ghostPosition)) {
    movePacman(newRow, newCol, ctx);
  }
}
