import { KeyValue } from "../../../interfaces/general";
import { getPaginatedData } from "../../../crud/data";
import { IncomingEmail, Alias } from "../../../interfaces/ara";
import {
  query,
  tableName,
  tableValues,
  removeReadOnlyValues,
  setValues
} from "../../mysql";
import { InsertResult } from "../../../interfaces/mysql";
import { isMatch } from "@staart/text";
import { Organization } from "../../../interfaces/tables/organization";
import { getOrganization } from "../../../crud/organization";

export const getOrganizationFromEmail = async (email: string) => {
  if (isMatch(email, "*@mail.araassistant.com")) {
    const emails = (await query(
      `SELECT * FROM ${tableName("organizations")} WHERE username = ? LIMIT 1`,
      [email.split("@")[0]]
    )) as Array<Organization>;
    if (emails.length) return emails[0];

    const aliases = (await query(
      `SELECT * FROM ${tableName("aliases")} WHERE alias = ? LIMIT 1`,
      [email.split("@")[0]]
    )) as Array<Alias>;
    if (aliases.length) return await getOrganization(aliases[0].organizationId);
  } else {
    const result = ((await query(
      `SELECT * FROM ${tableName(
        "organizations"
      )} WHERE customEmailAddress = ? LIMIT 1`,
      [email]
    )) as Array<Organization>)[0];
    if (result) return result;
  }
};

export const getOrganizationIncomingEmails = async (
  organizationId: string,
  query: KeyValue
) => {
  return getPaginatedData<IncomingEmail>({
    table: "incoming-emails",
    conditions: {
      organizationId
    },
    ...query
  });
};

export const getIncomingEmail = async (
  organizationId: string,
  incomingEmailId: string
) => {
  return ((await query(
    `SELECT * FROM ${tableName(
      "incoming-emails"
    )} WHERE id = ? AND organizationId = ? LIMIT 1`,
    [incomingEmailId, organizationId]
  )) as Array<IncomingEmail>)[0];
};

export const createIncomingEmail = async (
  incomingEmail: IncomingEmail
): Promise<InsertResult> => {
  incomingEmail.createdAt = new Date();
  incomingEmail.updatedAt = incomingEmail.createdAt;
  return query(
    `INSERT INTO ${tableName("incoming-emails")} ${tableValues(incomingEmail)}`,
    Object.values(incomingEmail)
  );
};

export const updateIncomingEmail = async (
  organizationId: string,
  incomingEmailId: string,
  data: KeyValue
) => {
  data.updatedAt = new Date();
  data = removeReadOnlyValues(data);
  await getIncomingEmail(organizationId, incomingEmailId);
  return query(
    `UPDATE ${tableName("incoming-emails")} SET ${setValues(
      data
    )} WHERE id = ? AND organizationId = ?`,
    [...Object.values(data), incomingEmailId, organizationId]
  );
};

export const deleteIncomingEmail = async (
  organizationId: string,
  incomingEmailId: string
) => {
  await getIncomingEmail(organizationId, incomingEmailId);
  return query(
    `DELETE FROM ${tableName(
      "incoming-emails"
    )} WHERE id = ? AND organizationId = ? LIMIT 1`,
    [incomingEmailId, organizationId]
  );
};
