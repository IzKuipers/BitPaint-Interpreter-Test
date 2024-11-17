import { Renderer } from ".";
import { Interpreter } from "..";
import { colorArrToRgb } from "../util";

export class HtmlCanvasRenderer extends Renderer {
  PIXEL_SIZE = 20;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  x = 0;
  y = 0;

  constructor(interpreter: Interpreter, canvas: HTMLCanvasElement) {
    super(interpreter);

    const context = canvas.getContext("2d");

    if (!context) throw new Error("Failed to get canvas context");

    this.context = context;
    this.canvas = canvas;
  }

  render() {
    this.x = 0;
    this.y = 0;
    this.canvas.width = this.interpreter.Size[0] * this.PIXEL_SIZE;
    this.canvas.height = this.interpreter.Size[1] * this.PIXEL_SIZE;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.interpreter.Memory.length; i++) {
      this.context.fillStyle = colorArrToRgb(
        this.interpreter.Depth[this.interpreter.Memory[i]]
      );

      this.context.fillRect(
        this.x * this.PIXEL_SIZE,
        this.y * this.PIXEL_SIZE,
        this.PIXEL_SIZE,
        this.PIXEL_SIZE
      );

      this.x++;

      if (this.x >= this.interpreter.Size[0]) {
        this.x = 0;
        this.y++;
      }
    }
  }
}
