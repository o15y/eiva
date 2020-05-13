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
  };
  company?: {
    id: string;
    name?: string;
    legalName?: string;
  };
}

export const getClearbitPersonFromEmail = async (email: string) => {
  return (
    await axios.get(
      `https://person-stream.clearbit.com/v2/combined/find?email=${email}`,
      {
        auth: {
          username: CLEARBIT_SECRET_KEY,
          password: "",
        },
      }
    )
  ).data as ClearbitResponse;
};
