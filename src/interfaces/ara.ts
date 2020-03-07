export type Logger = (...args: any[]) => void;
import { ParsedMail } from "mailparser";
import { IdRow } from "./general";

export interface ActionParams {
  organizationId: string;
  label: string;
  tokens: string[];
  log: Logger;
  objectBody: string;
  parsedBody: ParsedMail;
}

export interface IncomingEmail extends IdRow {
  objectId: string;
  organizationId: string;
  elasticId?: string;
}
