import { Logger } from "../../interfaces";
import { ParsedMail } from "mailparser";
import { organizations, users, incoming_emails } from "@prisma/client";
export declare const performAction: (incomingEmail: incoming_emails, organization: organizations, assistantEmail: string, user: users, objectBody: string, parsedBody: ParsedMail, log: Logger) => Promise<void>;
