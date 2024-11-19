import { ColorPalettes } from "./color";
import { HeaderInformation } from "./types";

export const HEADER_INFORMATION: HeaderInformation = [
  {
    A: [8, 8],
    B: [16, 16],
    C: [32, 32],
    D: [64, 64],
  },
  {
    T: ColorPalettes.twoColors,
    E: ColorPalettes.eightColors,
    S: ColorPalettes.sixteenColors,
  },
  {
    I: true,
    P: false,
  },
  {
    B: true,
    W: false,
  },
  {
    D: true,
    N: false,
  },
  {
    " ": true,
  },
];
