export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function randomPick(arr) {
  return arr[getRandomInt(arr.length)];
}
