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
  FillBlack = false;
  MaxByteHeight: number = 1;
  InstantMode: boolean = true;
  renderer: Renderer;
  bracketMap: Map<number, number> = new Map();

  constructor(
    input: string,
    renderer: RendererConstructor,
    ...rendererArgs: any[]
  ) {
    this.Input = input;

    this.parseHeader();
    this.fillMemory();
    this.preprocessBrackets();

    this.renderer = new renderer(this, ...rendererArgs);
  }

  parseHeader() {
    if (this.Input.length < 4)
      throw new Error("Insufficient input size for header");

    const headerBytes = this.Input.slice(0, 5);
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
    this.FillBlack = headerInfoArrayed[3];
    this.MaxByteHeight = this.Depth.length - 1;
    this.Instructions = this.Input.replace(headerBytes, "").split("");
  }

  fillMemory() {
    const dimension = this.Size[0] ** 2;

    this.Memory = new Array<number>(dimension).fill(0);
  }

  preprocessBrackets() {
    const stack: number[] = [];

    this.Instructions.forEach((instruction, index) => {
      if (instruction === "[") {
        stack.push(index);
      } else if (instruction === "]") {
        if (stack.length === 0) {
          throw new Error(`Unmatched ']' at position ${index}`);
        }
        const start = stack.pop()!;
        this.bracketMap.set(start, index);
        this.bracketMap.set(index, start);
      }
    });

    if (stack.length > 0) {
      throw new Error(`Unmatched '[' at position ${stack.pop()}`);
    }
  }

  async step() {
    const instruction = this.Instructions[this.InstructionPointer];

    switch (instruction) {
      case "<":
        this.decrementPointer();
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
      case "[":
        this.jumpForwardIfZero();
        break;
      case "]":
        this.jumpBackwardIfNotZero();
        break;
      case ".":
        this.renderer.render();
        if (!this.InstantMode) {
          await sleep(0);
        }
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

  jumpForwardIfZero() {
    if (this.Memory[this.MemoryPointer] === 0) {
      const target = this.bracketMap.get(this.InstructionPointer);
      if (typeof target === "undefined") {
        throw new Error(`Unmatched '[' at position ${this.InstructionPointer}`);
      }
      this.InstructionPointer = target;
    }
  }

  jumpBackwardIfNotZero() {
    if (this.Memory[this.MemoryPointer] !== 0) {
      const target = this.bracketMap.get(this.InstructionPointer);
      if (typeof target === "undefined") {
        throw new Error(`Unmatched ']' at position ${this.InstructionPointer}`);
      }
      this.InstructionPointer = target;
    }
  }

  decrementPointer() {
    this.MemoryPointer--;
    if (this.MemoryPointer < 0) throw new Error("Memory pointer out of bounds");
  }

  incrementPointer() {
    this.MemoryPointer++;
    if (this.MemoryPointer >= this.Memory.length)
      throw new Error(
        `Memory pointer out of bounds ${this.MemoryPointer} >= ${this.Memory.length}`
      );
  }

  incrementByte() {
    this.Memory[this.MemoryPointer]++;

    if (this.Memory[this.MemoryPointer] > this.MaxByteHeight) {
      this.Memory[this.MemoryPointer] = 0; // Wrap around to 0
    }
  }

  decrementByte() {
    this.Memory[this.MemoryPointer]--;
    if (this.Memory[this.MemoryPointer] < 0)
      throw new Error(`Byte ${this.MemoryPointer} below min`);
  }

  async Execute() {
    const start = Date.now();
    console.log(`Beginning execution`);

    this.InstructionPointer = 0;
    this.MemoryPointer = 0;
    this.fillMemory();

    while (this.InstructionPointer < this.Instructions.length) {
      await this.step();
    }

    const end = Date.now() - start;
    console.log(`Stopped execution: ${end}ms`);
  }
}
