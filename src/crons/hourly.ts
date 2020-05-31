import { ms } from "@staart/text";
import { CronJob } from "cron";
import { TOKEN_EXPIRY_REFRESH } from "../config";
import { prisma } from "../_staart/helpers/prisma";

export default () => {
  new CronJob(
    "0 * * * *",
    async () => {
      await deleteExpiredSessions();
      await updatePendingEmails();
    },
    undefined,
    true
  );
};

const deleteExpiredSessions = async () => {
  try {
    await prisma.sessions.deleteMany({
      where: {
        createdAt: {
          lte: new Date(new Date().getTime() - ms(TOKEN_EXPIRY_REFRESH)),
        },
      },
    });
  } catch (error) {}
};

const updatePendingEmails = async () => {
  try {
    await prisma.incoming_emails.updateMany({
      data: {
        status: "ERROR",
      },
      where: {
        status: "PENDING",
        emailType: "INCOMING",
        createdAt: {
          lte: new Date(new Date().getTime() - ms("10m")),
        },
      },
    });
  } catch (error) {}
};
