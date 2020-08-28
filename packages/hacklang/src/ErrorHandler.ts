import { Location } from "./grammer/Token";

export class ErrorHandler {
  source: string;
  lines: string[];
  constructor(source: string) {
    this.source = source;
    this.lines = this.source.split("\n");
  }

  createError(message: string, location: Location): void {
    const padding = " ".repeat(10);
    console.error(padding + this.lines[location.line]);
    console.error(padding + " ".repeat(location.column) + "^");
    console.error("Error: " + message);
    process.exit(1);
  }
}
