import { simpleParser } from "mailparser";
import { ActionParams } from "../interfaces";
import { prisma } from "../../_staart/helpers/prisma";

/** Parse the given email */
export const parseEmail = async (text: string) => {
  return simpleParser(text);
};

/** Recommend a location ID from text */
export const findLocationFromText = async (params: ActionParams) => {
  const text = params.tokens.join(" ").split(" ");
  let locationId = params.organization.schedulingLocation;
  const locations = await prisma.locations.findMany({
    where: { organizationId: params.organization.id },
    orderBy: { id: "desc" },
  });

  const inPersonLocation = locations.find((i) => i.type === "IN_PERSON");
  ["office", "meeting", "lunch", "dinner", "breakfast", "coffee"].forEach(
    (term) => {
      if (text.includes(term) && inPersonLocation)
        locationId = inPersonLocation.id;
    }
  );

  const videoCallLocation = locations.find((i) => i.type === "VIDEO_CALL");
  ["video", "call"].forEach((term) => {
    if (text.includes(term) && videoCallLocation)
      locationId = videoCallLocation.id;
  });

  const phoneCallLocation = locations.find((i) => i.type === "PHONE_CALL");
  ["phone", "call"].forEach((term) => {
    if (text.includes(term) && !text.includes("video") && phoneCallLocation)
      locationId = phoneCallLocation.id;
  });

  for await (const location of locations) {
    if (text.includes(location.value.toLowerCase())) locationId = location.id;

    let data: any = {};
    try {
      if (location.data) data = JSON.parse(location.data);
    } catch (error) {}
    if (data.name && text.includes(data.name.split(" ")))
      locationId = location.id;
  }
  return locationId;
};
