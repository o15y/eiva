import axios from "axios";
import { Entity } from "../../interfaces/google-cloud";
import { readJson, writeJson } from "fs-extra";
import { join } from "path";
import { createHash } from "crypto";

export const detectEntities = async (
  text: string
): Promise<{
  language: string;
  entities: Entity[];
  numbers: Entity[];
  unknowns: Entity[];
  persons: Entity[];
  locations: Entity[];
  organizations: Entity[];
  events: Entity[];
  workOfArts: Entity[];
  consumerGoods: Entity[];
  others: Entity[];
  phoneNumbers: Entity[];
  addresses: Entity[];
  dates: Entity[];
  prices: Entity[];
}> => {
  const KEY = `googlecloud${createHash("md5")
    .update(text)
    .digest("hex")}.json`;
  if (process.env.NODE_ENV === "development") {
    try {
      const file = await readJson(join(".", ".cache", KEY));
      if (file) return file;
    } catch (error) {}
  }
  try {
    const data = (
      await axios.post<{
        language: string;
        entities: Entity[];
      }>(
        `https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.NATURAL_LANGUAGE_API_KEY}`,
        {
          document: {
            content: text,
            type: "PLAIN_TEXT"
          },
          encodingType: "UTF8"
        },
        {}
      )
    ).data;
    const result: any = { ...data };
    result.numbers = data.entities.filter(i => i.type === "NUMBER");
    result.unknowns = data.entities.filter(i => i.type === "UNKNOWN");
    result.persons = data.entities.filter(i => i.type === "PERSON");
    result.locations = data.entities.filter(i => i.type === "LOCATION");
    result.organizations = data.entities.filter(i => i.type === "ORGANIZATION");
    result.events = data.entities.filter(i => i.type === "EVENT");
    result.workOfArts = data.entities.filter(i => i.type === "WORK_OF_ART");
    result.consumerGoods = data.entities.filter(
      i => i.type === "CONSUMER_GOOD"
    );
    result.others = data.entities.filter(i => i.type === "OTHER");
    result.phoneNumbers = data.entities.filter(i => i.type === "PHONE_NUMBER");
    result.addresses = data.entities.filter(i => i.type === "ADDRESS");
    result.dates = data.entities.filter(i => i.type === "DATE");
    result.prices = data.entities.filter(i => i.type === "PRICE");
    if (process.env.NODE_ENV === "development") {
      await writeJson(join(".", ".cache", KEY), result);
    }
    return result;
  } catch (error) {
    throw new Error("Unable to detect entities in text");
  }
};
