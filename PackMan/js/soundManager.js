export function playSound(soundPath) {
    const audio = new Audio(soundPath);
    audio.play();
}