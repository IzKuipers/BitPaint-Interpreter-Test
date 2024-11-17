import { Color } from "../types/color";
import { Size } from "../types/properties";
import { RendererConstructor } from "../types/renderer";
import { ColorPalettes } from "./color";
import { HEADER_INFORMATION } from "./header";
import { Renderer } from "./renderer";
import { sleep } from "./util";

export class Interpreter {
  Memory: number[] = [];
  Input: string = "";
  Instructions: string[] = [];
  InstructionPointer = 0;
  MemoryPointer = 0;
  Size: Size = [0, 0];
  Depth: Color[] = ColorPalettes.twoColors;
  MaxByteHeight: number = 1;
  InstantMode: boolean = true;
  renderer: Renderer;

  constructor(
    input: string,
    renderer: RendererConstructor,
    ...rendererArgs: any[]
  ) {
    this.Input = input;

    this.parseHeader();
    this.fillMemory();

    this.renderer = new renderer(this, ...rendererArgs);
  }

  parseHeader() {
    if (this.Input.length < 4)
      throw new Error("Insufficient input size for header");

    const headerBytes = this.Input.slice(0, 4);
    const headerInfoArrayed: any[] = [];

    for (let i = 0; i < HEADER_INFORMATION.length; i++) {
      const headerByte = headerBytes[i];
      const info = HEADER_INFORMATION[i][headerByte];

      if (typeof info === "undefined") {
        throw new Error(`Unknown byte ${headerByte} at header position ${i}`);
      }

      headerInfoArrayed.push(info);
    }

    this.Size = headerInfoArrayed[0];
    this.Depth = headerInfoArrayed[1];
    this.InstantMode = headerInfoArrayed[2];
    this.MaxByteHeight = this.Depth.length - 1;
    this.Instructions = this.Input.replace(headerBytes, "").split("");
  }

  fillMemory() {
    const dimension = this.Size[0] ** 2;

    this.Memory = new Array<number>(dimension).fill(0);
  }

  step() {
    const instruction = this.Instructions[this.InstructionPointer];

    switch (instruction) {
      case "<":
        this.decrememtPointer();
        break;
      case ">":
        this.incrementPointer();
        break;
      case "+":
        this.incrementByte();
        break;
      case "-":
        this.decrementByte();
        break;
      case " ":
      case "\n":
        break;
      default:
        throw new Error(
          `Unknown instruction at ${this.InstructionPointer}: ${instruction}`
        );
    }

    this.InstructionPointer++;
  }

  decrememtPointer() {
    this.MemoryPointer--;
    if (this.MemoryPointer < 0) throw new Error("Memory pointer out of bounds");
  }

  incrementPointer() {
    this.MemoryPointer++;
    if (this.MemoryPointer > this.Memory.length)
      throw new Error(
        `Memory pointer out of bounds ${this.MemoryPointer} > ${this.Memory.length}`
      );
  }

  incrementByte() {
    this.Memory[this.MemoryPointer]++;
    if (this.Memory[this.MemoryPointer] > this.MaxByteHeight)
      throw new Error(`Byte ${this.MemoryPointer} above max`);
  }

  decrementByte() {
    this.Memory[this.MemoryPointer]--;
    if (this.Memory[this.MemoryPointer] < 0)
      throw new Error(`Byte ${this.MemoryPointer} below min`);
  }

  async Execute() {
    console.log(`Beginning execution`);
    const start = Date.now();
    this.InstructionPointer = 0;
    this.MemoryPointer = 0;
    this.fillMemory();

    while (this.InstructionPointer < this.Instructions.length) {
      this.step();

      if (!this.InstantMode) {
        this.renderer.render();
        await sleep(0);
      }
    }

    this.renderer.render();
    const end = Date.now() - start;
    console.log(`Stopped execution: ${end}ms`);
  }
}
