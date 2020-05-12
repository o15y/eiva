import { ActionParams, Logger } from "../../interfaces";
import { setupNewAppointment } from "./setupNewAppointment";
import { rescheduleAppointment } from "./rescheduleAppointment";
import { cancelAppointment } from "./cancelAppointment";
import { scheduleSummary } from "./scheduleSummary";
import { smartTokensFromText } from "../tokenize";
import { classifyTokens } from "../classify";
import { ParsedMail } from "mailparser";
import { organizations, users } from "@prisma/client";

export const performAction = async (
  organization: organizations,
  assistantEmail: string,
  user: users,
  objectBody: string,
  parsedBody: ParsedMail,
  log: Logger
) => {
  if (!(parsedBody.text && parsedBody.from))
    throw new Error("Couldn't find text or from");
  const tokens = await smartTokensFromText(parsedBody.text, parsedBody.from);
  log("Smart tokenized sentences", tokens);
  const label = classifyTokens(tokens, log);
  log(`Classified text as "${label}"`);
  return await act({
    organization,
    assistantEmail,
    user,
    objectBody,
    parsedBody,
    tokens,
    label,
    log,
  });
};

const act = async (params: ActionParams) => {
  if (params.label === "setupNewAppointment")
    return await setupNewAppointment(params);
  if (params.label === "rescheduleAppointment")
    return await rescheduleAppointment(params);
  if (params.label === "cancelAppointment")
    return await cancelAppointment(params);
  if (params.label === "scheduleSummary") return await scheduleSummary(params);
  throw new Error("Requested an unknown action");
};
