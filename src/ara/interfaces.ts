export type Logger = (...args: any[]) => void;
import { ParsedMail } from "mailparser";
import { organizations } from "@prisma/client";
import { IdRow } from "../_staart/interfaces/general";

export interface ActionParams {
  organization: organizations;
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
