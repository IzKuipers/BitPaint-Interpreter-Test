import { Colors } from "./types";

export const ColorPalettes: Colors = {
  twoColors: [
    [0, 0, 0],
    [255, 255, 255],
  ],
  eightColors: [
    [0, 0, 0], // Black
    [0, 0, 255], // Blue
    [0, 255, 0], // Green
    [0, 255, 255], // Cyan
    [255, 0, 0], // Red
    [255, 0, 255], // Magenta
    [128, 64, 0], // Brown
    [255, 255, 255], // White
  ],
  sixteenColors: [
    // First half
    [0, 0, 0], // Black
    [0, 0, 128], // Blue
    [0, 128, 0], // Green
    [0, 128, 128], // Cyan
    [128, 0, 0], // Red
    [128, 0, 128], // Magenta
    [128, 128, 0], // Yellow
    [128, 128, 128], // White
    // Second Half
    [64, 64, 64], // Gray
    [0, 0, 255], // Light Blue
    [0, 255, 0], // Light Green
    [0, 255, 255], // Light Cyan
    [255, 0, 0], // Light Red
    [255, 0, 128], // Light Magenta
    [255, 255, 0], // Light Yellow
    [255, 255, 255], // Light White
  ],
};
