import { simpleParser } from "mailparser";

export const parseEmail = async (text: string) => {
  return simpleParser(text);
};
