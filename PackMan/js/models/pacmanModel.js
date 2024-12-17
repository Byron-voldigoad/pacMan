

export let pacman = {
  row: 15,
  col: 33,
  direction: "",
};

export function resetPacmanPosition() {
  pacman = { row: 15, col: 33, direction: "" };  // Réinitialisation des coordonnées
  console.log("Pac-Man réinitialisé:", pacman);
}

export let lives = 3;

export function live(){
  return lives -= 1;
}




