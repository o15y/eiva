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
interface MetadataDate extends MetadataBase {
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