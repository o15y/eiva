export declare type Logger = (...args: any[]) => void;
import { ParsedMail } from "mailparser";
import { organizations, users, incoming_emails } from "@prisma/client";
import { IdRow } from "../_staart/interfaces/general";
export interface ActionParams {
    incomingEmail: incoming_emails;
    organization: organizations;
    assistantEmail: string;
    user: users;
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
