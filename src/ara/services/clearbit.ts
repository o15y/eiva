import axios from "axios";

const CLEARBIT_SECRET_KEY = process.env.CLEARBIT_SECRET_KEY ?? "";

export interface ClearbitResponse {
  person?: {
    id: string;
    name?: {
      fullName?: string;
      givenName?: string;
      familyName?: string;
    };
    timeZone?: string;
  };
  company?: {
    id: string;
    name?: string;
    legalName?: string;
    timeZone?: string;
  };
}

export const getClearbitPersonFromEmail = async (email: string) => {
  return (
    await axios.get(
      `https://person-stream.clearbit.com/v2/combined/find?email=${encodeURIComponent(
        email
      )}`,
      {
        headers: {
          Authorization: `Bearer ${CLEARBIT_SECRET_KEY}`,
        },
      }
    )
  ).data as ClearbitResponse;
};
