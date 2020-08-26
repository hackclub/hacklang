import { TokenType } from "./TokenType";

export interface Location {
  line: number;
  column: number;
}

export interface Token {
  type: TokenType;
  value: string;
  loc?: {
    start: Location;
    end: Location;
  };
}
