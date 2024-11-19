import { Color } from "./types";

export const colorArrToRgb = (color: Color) =>
  `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

export const sleep = (m = 0) => new Promise((r) => setTimeout(r, m));
