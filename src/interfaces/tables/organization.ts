import { Webhooks } from "../enum";
import { IdRow } from "../general";

export interface Organization extends IdRow {
  name?: string;
  username?: string;
  forceTwoFactor?: boolean;
  autoJoinDomain?: boolean;
  onlyAllowDomain?: boolean;
  ipRestrictions?: string;
  stripeCustomerId?: string;
  profilePicture?: string;

  // Ara-specific
  assistantName?: string;
  assistantSignature?: string;
  schedulingDays?: string[];
  schedulingTimeStart?: string;
  schedulingTimeEnd?: string;
  schedulingPadding?: string;
  calendars?: string[];
  customEmailEnabled?: boolean;
  customEmailAddress?: string;
  customEmailHost?: string;
  customEmailPort?: string;
  customEmailSecure?: boolean;
  customEmailUsername?: string;
  customEmailPassword?: string;
}

export interface ApiKey extends IdRow {
  name?: string;
  description?: string;
  jwtApiKey?: string;
  scopes?: string;
  organizationId: string;
  ipRestrictions?: string;
  referrerRestrictions?: string;
  expiresAt?: Date;
}

export interface Domain extends IdRow {
  organizationId: string;
  domain: string;
  verificationCode?: string;
  isVerified: boolean;
}

export interface Webhook extends IdRow {
  organizationId: string;
  url: string;
  event: Webhooks;
  contentType: "application/json" | "application/x-www-form-urlencoded";
  secret?: string;
  isActive: boolean;
}
