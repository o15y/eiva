import { isMatch } from "@staart/text";
import { prisma } from "../../_staart/helpers/prisma";
import { ORGANIZATION_NOT_FOUND } from "@staart/errors";

export const getOrganizationFromEmail = async (email: string) => {
  if (isMatch(email, "*@mail.araassistant.com")) {
    let username = email.split("@")[0];
    if (username.startsWith("meet-"))
      username = username.substring("meet-".length);
    const orgFromEmails = await prisma.organizations.findOne({
      where: { username },
    });
    if (orgFromEmails) return orgFromEmails;

    // TODO: Support for aliases
    // // const aliases = (await query(
    // //   `SELECT * FROM ${tableName("aliases")} WHERE alias = ? LIMIT 1`,
    // //   [email.split("@")[0]]
    // // )) as Array<Alias>;
    // if (aliases.length) return await getOrganization(aliases[0].organizationId);
  } else {
    const orgFromCustomEmail = await prisma.organizations.findMany({
      where: { customEmailAddress: email },
    });
    if (orgFromCustomEmail.length) return orgFromCustomEmail[0];
  }
  throw new Error(ORGANIZATION_NOT_FOUND);
};

// export const getOrganizationIncomingEmails = async (
//   organizationId: string,
//   query: KeyValue
// ) => {
//   return getPaginatedData<IncomingEmail>({
//     table: "incoming-emails",
//     conditions: {
//       organizationId,
//     },
//     ...query,
//   });
// };

// export const getIncomingEmail = async (
//   organizationId: string,
//   incomingEmailId: string
// ) => {
//   return ((await query(
//     `SELECT * FROM ${tableName(
//       "incoming-emails"
//     )} WHERE id = ? AND organizationId = ? LIMIT 1`,
//     [incomingEmailId, organizationId]
//   )) as Array<IncomingEmail>)[0];
// };

// export const createIncomingEmail = async (
//   incomingEmail: IncomingEmail
// ): Promise<InsertResult> => {
//   incomingEmail.createdAt = new Date();
//   incomingEmail.updatedAt = incomingEmail.createdAt;
//   return query(
//     `INSERT INTO ${tableName("incoming-emails")} ${tableValues(incomingEmail)}`,
//     Object.values(incomingEmail)
//   );
// };

// export const updateIncomingEmail = async (
//   organizationId: string,
//   incomingEmailId: string,
//   data: KeyValue
// ) => {
//   data.updatedAt = new Date();
//   data = removeReadOnlyValues(data);
//   await getIncomingEmail(organizationId, incomingEmailId);
//   return query(
//     `UPDATE ${tableName("incoming-emails")} SET ${setValues(
//       data
//     )} WHERE id = ? AND organizationId = ?`,
//     [...Object.values(data), incomingEmailId, organizationId]
//   );
// };

// export const deleteIncomingEmail = async (
//   organizationId: string,
//   incomingEmailId: string
// ) => {
//   await getIncomingEmail(organizationId, incomingEmailId);
//   return query(
//     `DELETE FROM ${tableName(
//       "incoming-emails"
//     )} WHERE id = ? AND organizationId = ? LIMIT 1`,
//     [incomingEmailId, organizationId]
//   );
// };
