import { Color } from "./color";
import { Size } from "./properties";

export type HeaderInformation = [
  Record<string, Size>,
  Record<string, Color[]>,
  Record<string, boolean>,
  Record<string, boolean>,
  Record<string, boolean>,
  Record<string, boolean>
];
