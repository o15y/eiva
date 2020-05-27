import axios from "axios";

let keys: string[] = [];
for (let i = 0; i < 10; i++) {
  const key = process.env[`CLEARBIT_SECRET_KEY_${i}`];
  if (key) keys.push(key);
}
let lastUsedKey = 0;
const getApiKey = () => {
  const result = keys[lastUsedKey];
  lastUsedKey++;
  if (lastUsedKey === keys.length) lastUsedKey = 0;
  return result;
};

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
          Authorization: `Bearer ${getApiKey()}`,
        },
      }
    )
  ).data as ClearbitResponse;
};
