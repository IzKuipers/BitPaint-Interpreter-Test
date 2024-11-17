import { Interpreter } from "../interpreter";
import { Renderer } from "../interpreter/renderer";

export type RendererConstructor = new (
  context: Interpreter,
  ...args: any[]
) => Renderer;
