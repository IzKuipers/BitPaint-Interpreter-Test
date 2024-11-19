import { Interpreter } from ".";
import { Renderer } from "./renderer";

export type Size = [w: number, h: number];

export type Color = [r: number, g: number, b: number];
export type Colors = Record<string, Color[]>;

export type HeaderInformation = [
  Record<string, Size>,
  Record<string, Color[]>,
  Record<string, boolean>,
  Record<string, boolean>,
  Record<string, boolean>,
  Record<string, boolean>
];

export type RendererConstructor = new (
  context: Interpreter,
  ...args: any[]
) => Renderer;
