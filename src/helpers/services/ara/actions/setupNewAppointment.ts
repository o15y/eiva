import { ActionParams } from "../../../../interfaces/ara";
import { detectEntities } from "../../google-cloud";

export const setupNewAppointment = async (params: ActionParams) => {
  const { entities, language } = await detectEntities(params.tokens.join(". "));
  params.log("Found entities", entities);
  params.log(`Detected language as "${language}"`);
  throw new Error("I don't know how to set up a new appointment");
};
