import { getItemFromCache } from "../../_staart/helpers/cache";

export const getFullToken = async (shortToken: string) => {
  try {
    const token = await getItemFromCache<string>(shortToken);
    if (token) return token;
  } catch (error) {}
  return shortToken;
};
