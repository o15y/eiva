export type Logger = (...args: any[]) => void;
import { ParsedMail } from "mailparser";
import { IdRow } from "./general";
import { Organization } from "./tables/organization";

export interface ActionParams {
  organization: Organization;
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

export interface Alias extends IdRow {
  alias: string;
  organizationId: string;
}
