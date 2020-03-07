import { ActionParams } from "../../../../interfaces/ara";
import { setupNewAppointment } from "./setupNewAppointment";
import { rescheduleAppointment } from "./rescheduleAppointment";
import { cancelAppointment } from "./cancelAppointment";
import { scheduleSummary } from "./scheduleSummary";

export const performAction = async (params: ActionParams) => {
  if (params.label === "setupNewAppointment")
    return await setupNewAppointment(params);
  if (params.label === "rescheduleAppointment")
    return await rescheduleAppointment(params);
  if (params.label === "cancelAppointment")
    return await cancelAppointment(params);
  if (params.label === "scheduleSummary") return await scheduleSummary(params);
  throw new Error("Requested an unknown action");
};
