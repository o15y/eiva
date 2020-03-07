export type Logger = (...args: any[]) => void;
import { ParsedMail } from "mailparser";

export interface ActionParams {
  label: string;
  tokens: string[];
  log: Logger;
  objectBody: string;
  parsedBody: ParsedMail;
}
