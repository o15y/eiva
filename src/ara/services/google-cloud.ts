import axios from "axios";
import { readJson, writeJson } from "fs-extra";
import { join } from "path";
import { createHash } from "crypto";

export type Entity =
  | EntityNumber
  | EntityUnknown
  | EntityPerson
  | EntityLocation
  | EntityOrganization
  | EntityEvent
  | EntityWorkOfArt
  | EntityConsumerGood
  | EntityOther
  | EntityPhoneNumber
  | EntityAddress
  | EntityDate
  | EntityNumber
  | EntityPrice;

interface MetadataBase {
  wikipedia_url: string;
  mid: string;
}

interface Mention {
  text: {
    content: string;
    beginOffset: number;
  };
  type: "TYPE_UNKNOWN" | "PROPER" | "COMMON";
  sentiment: { magnitude: number; score: number };
}

interface EntityBase {
  name: string;
  salience: number;
  metadata: MetadataBase;
  mentions: Mention[];
}

interface MetadataPrice extends MetadataBase {
  value: string;
  currency: string;
}
export interface MetadataDate extends MetadataBase {
  year?: string;
  month?: string;
  day?: string;
}
interface MetadataAddress extends MetadataBase {
  street_number?: string;
  locality?: string;
  street_name?: string;
  postal_code?: string;
  country?: string;
  broad_region?: string;
  narrow_region?: string;
  sublocality?: string;
}
interface MetadataPhoneNumber extends MetadataBase {
  number?: string;
  national_prefix?: string;
  area_code?: string;
  extension?: string;
}

export interface EntityNumber extends EntityBase {
  type: "NUMBER";
}

export interface EntityUnknown extends EntityBase {
  type: "UNKNOWN";
}

export interface EntityPerson extends EntityBase {
  type: "PERSON";
}

export interface EntityLocation extends EntityBase {
  type: "LOCATION";
}

export interface EntityOrganization extends EntityBase {
  type: "ORGANIZATION";
}

export interface EntityEvent extends EntityBase {
  type: "EVENT";
}

export interface EntityWorkOfArt extends EntityBase {
  type: "WORK_OF_ART";
}

export interface EntityConsumerGood extends EntityBase {
  type: "CONSUMER_GOOD";
}

export interface EntityOther extends EntityBase {
  type: "OTHER";
}

export interface EntityPhoneNumber extends EntityBase {
  type: "PHONE_NUMBER";
  metadata: MetadataPhoneNumber;
}

export interface EntityAddress extends EntityBase {
  type: "ADDRESS";
  metadata: MetadataAddress;
}

export interface EntityDate extends EntityBase {
  type: "DATE";
  metadata: MetadataDate;
}

export interface EntityNumber extends EntityBase {
  type: "NUMBER";
}

export interface EntityPrice extends EntityBase {
  type: "PRICE";
  metadata: MetadataPrice;
}

export const detectEntities = async (
  text: string
): Promise<{
  language: string;
  entities: Entity[];
  numbers: EntityNumber[];
  unknowns: EntityUnknown[];
  persons: EntityPerson[];
  locations: EntityLocation[];
  organizations: EntityOrganization[];
  events: EntityEvent[];
  workOfArts: EntityWorkOfArt[];
  consumerGoods: EntityConsumerGood[];
  others: EntityOther[];
  phoneNumbers: EntityPhoneNumber[];
  addresses: EntityAddress[];
  dates: EntityDate[];
  prices: EntityPrice[];
}> => {
  const KEY = `googlecloud${createHash("md5").update(text).digest("hex")}.json`;
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
            type: "PLAIN_TEXT",
          },
          encodingType: "UTF8",
        },
        {}
      )
    ).data;
    const result: any = { ...data };
    result.numbers = data.entities.filter((i) => i.type === "NUMBER");
    result.unknowns = data.entities.filter((i) => i.type === "UNKNOWN");
    result.persons = data.entities.filter((i) => i.type === "PERSON");
    result.locations = data.entities.filter((i) => i.type === "LOCATION");
    result.organizations = data.entities.filter(
      (i) => i.type === "ORGANIZATION"
    );
    result.events = data.entities.filter((i) => i.type === "EVENT");
    result.workOfArts = data.entities.filter((i) => i.type === "WORK_OF_ART");
    result.consumerGoods = data.entities.filter(
      (i) => i.type === "CONSUMER_GOOD"
    );
    result.others = data.entities.filter((i) => i.type === "OTHER");
    result.phoneNumbers = data.entities.filter(
      (i) => i.type === "PHONE_NUMBER"
    );
    result.addresses = data.entities.filter((i) => i.type === "ADDRESS");
    result.dates = data.entities.filter((i) => i.type === "DATE");
    result.prices = data.entities.filter((i) => i.type === "PRICE");
    if (process.env.NODE_ENV === "development") {
      await writeJson(join(".", ".cache", KEY), result);
    }
    return result;
  } catch (error) {
    if (
      error?.response?.data?.error?.message?.startsWith("The language") &&
      error?.response?.data?.error?.message?.endsWith(
        "not supported for entity analysis."
      )
    ) {
      return {
        language: error?.response?.data?.error?.message
          .split("The language ")[1]
          .split(" ")[0],
        persons: [],
        locations: [],
        organizations: [],
        events: [],
        consumerGoods: [],
        phoneNumbers: [],
        addresses: [],
        dates: [],
      } as any;
    }
    throw new Error("Unable to detect entities in text");
  }
};
