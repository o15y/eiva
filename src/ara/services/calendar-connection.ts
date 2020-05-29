import ClientOAuth2 from "client-oauth2";
import { BASE_URL } from "../../config";
import { google } from "googleapis";

export const googleCalendarClient = {
  client: new ClientOAuth2({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: `${BASE_URL}/api/calendar-connection/google/callback`,
    authorizationUri: "https://accounts.google.com/o/oauth2/v2/auth",
    accessTokenUri: "https://www.googleapis.com/oauth2/v4/token",
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  }),
  callback: async (url: string) => {
    const token = await google.client.code.getToken(url);
    console.log("Got Google response", JSON.stringify(token.accessToken));
    return { ok: true };
  },
};
