import { ActionParams, Logger } from "../../interfaces";
import { setupNewAppointment } from "./setupNewAppointment";
import { rescheduleAppointment } from "./rescheduleAppointment";
import { cancelAppointment } from "./cancelAppointment";
import { scheduleSummary } from "./scheduleSummary";
import { smartTokensFromText } from "../tokenize";
import { classifyTokens } from "../classify";
import { ParsedMail } from "mailparser";
import { organizations } from "@prisma/client";

export const performAction = async (
  organization: organizations,
  objectBody: string,
  parsedBody: ParsedMail,
  log: Logger
) => {
  const tokens = await smartTokensFromText(parsedBody.text, parsedBody.from);
  log("Smart tokenized sentences", tokens);
  const label = classifyTokens(tokens, log);
  log(`Classified text as "${label}"`);
  return await act({
    organization,
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
