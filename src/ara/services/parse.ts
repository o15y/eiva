import { simpleParser } from "mailparser";

/** Parse the given email */
export const parseEmail = async (text: string) => {
  return simpleParser(text);
};

/** Recommend a location ID from text */
export const findLocationFromText = async (text: string) => {
  //
  return 1;
};
