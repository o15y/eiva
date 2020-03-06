import natural from "natural";
const tokenizer = new (natural as any).SentenceTokenizer() as natural.WordTokenizer;
import parseReply from "node-email-reply-parser";
import { removeSignature } from "email-signature-detector";
import { AddressObject } from "mailparser";

export const smartTokensFromText = async (
  text: string,
  from: AddressObject
) => {
  // Divide paragraph into lines and remove empty lines
  const paragraphs = removeSignature(parseReply(text).getVisibleText(), {
    email: from.value[0].address,
    displayName: from.value[0].name
  })
    .split("\n")
    .filter(i => i.trim());

  // Tokenize each line to a sentence
  const tokens: string[][] = [];
  paragraphs.forEach(paragraph => tokens.push(tokenizer.tokenize(paragraph)));

  console.log(tokens);
  return tokens;
};
