export const ESC = "\u001B[";
export const OSC = "\u001B]";
export const BEL = "\u0007";
export const SEP = ";";

export function setFgColor(r: number, g: number, b: number) {
  return `${ESC}38;2;${r};${g};${b}m`;
}

export function setBgColor(r: number, g: number, b: number) {
  return `${ESC}48;2;${r};${g};${b}m`;
}

export function resetColors() {
  return `${ESC}0m`;
}
