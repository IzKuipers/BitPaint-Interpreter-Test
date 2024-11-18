import { Interpreter } from "./interpreter";
import { HtmlCanvasRenderer } from "./interpreter/renderer/html";

async function Main() {
  const canvas = document.createElement("canvas");

  document.body.append(canvas);

  const interpreter = new Interpreter(
    `CSPB >++++++++[>++++++++<-].
`,
    HtmlCanvasRenderer,
    canvas
  );

  console.log(interpreter);
  interpreter.Execute();
}

Main();
