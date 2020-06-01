import { isMatch } from "@staart/text";
import { prisma } from "../../../_staart/helpers/prisma";
import { ORGANIZATION_NOT_FOUND } from "@staart/errors";

export const getOrganizationFromEmail = async (email: string) => {
  if (
    isMatch(email, "*@mail.araassistant.com") ||
    isMatch(email, "*@myeiva.com")
  ) {
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
