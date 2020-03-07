export type Entity =
  | EntityNumber
  | EntityUnknown
  | EntityPerson
  | EntityLocation
  | EntityOrganization
  | EntityEvent
  | EntityWork_of_art
  | EntityConsumer_good
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

interface EntityNumber extends EntityBase {
  type: "NUMBER";
}

interface EntityUnknown extends EntityBase {
  type: "UNKNOWN";
}

interface EntityPerson extends EntityBase {
  type: "PERSON";
}

interface EntityLocation extends EntityBase {
  type: "LOCATION";
}

interface EntityOrganization extends EntityBase {
  type: "ORGANIZATION";
}

interface EntityEvent extends EntityBase {
  type: "EVENT";
}

interface EntityWork_of_art extends EntityBase {
  type: "WORK_OF_ART";
}

interface EntityConsumer_good extends EntityBase {
  type: "CONSUMER_GOOD";
}

interface EntityOther extends EntityBase {
  type: "OTHER";
}

interface EntityPhoneNumber extends EntityBase {
  type: "PHONE_NUMBER";
  metadata: MetadataPhoneNumber;
}

interface EntityAddress extends EntityBase {
  type: "ADDRESS";
  metadata: MetadataAddress;
}

interface EntityDate extends EntityBase {
  type: "DATE";
  metadata: MetadataDate;
}

interface EntityNumber extends EntityBase {
  type: "NUMBER";
}

interface EntityPrice extends EntityBase {
  type: "PRICE";
  metadata: MetadataPrice;
}
