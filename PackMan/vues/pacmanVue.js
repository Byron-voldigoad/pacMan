const cellSize = 30;
let mouthAngle = 1; // Angle initial de la bouche (0 = complètement fermé)
let mouthDirection = 1; // Contrôle l'ouverture et la fermeture (1 = ouverture, -1 = fermeture)

export function drawPacman(ctx, pacman) {
  const x = pacman.col * 30 + 15; // Position X du centre de Pac-Man
  const y = pacman.row * 30 + 15; // Position Y du centre de Pac-Man
  const radius = 14; // Rayon de Pac-Man

  let startAngle, endAngle;

  // Modifier les angles selon la direction
  switch (pacman.direction) {
    case "up":
      startAngle = Math.PI * 1.65 + mouthAngle;
      endAngle = Math.PI * 1.3 - mouthAngle;
      break;
    case "down":
      startAngle = Math.PI * 4.65 + mouthAngle;
      endAngle = Math.PI * 4.3 - mouthAngle;
      break;
    case "left":
      startAngle = Math.PI * 3.15 + mouthAngle;
      endAngle = Math.PI * 0.90 - mouthAngle;
      break;
    case "right":
    default:
      startAngle = Math.PI * 0.10 + mouthAngle;
      endAngle = Math.PI * 0 - mouthAngle;
      break;
  }

  // Dessiner Pac-Man
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, startAngle, endAngle, false);
  ctx.closePath();
  ctx.fillStyle = "yellow";
  ctx.fill();
}



export function animatePacmanMouth() {
  const maxMouthAngle = 1; // Maximum d'ouverture de la bouche
  const minMouthAngle = 0; // Minimum (presque fermé)

  // Inverse la direction si l'angle atteint les limites
  if (mouthAngle >= maxMouthAngle) mouthDirection = -1;
  if (mouthAngle <= minMouthAngle) mouthDirection = 1;

  // Mise à jour de l'angle de la bouche
  mouthAngle += mouthDirection * 0.2; // Ajustez la vitesse avec ce facteur
}


