import { KeyValue } from "../../../interfaces/general";
import { getPaginatedData } from "../../../crud/data";
import { IncomingEmail } from "../../../interfaces/ara";
import {
  query,
  tableName,
  tableValues,
  removeReadOnlyValues,
  setValues
} from "../../mysql";
import { InsertResult } from "../../../interfaces/mysql";

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
