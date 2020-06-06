import natural from "natural";
const tokenizer = new (natural as any).SentenceTokenizer() as natural.WordTokenizer;
import parseReply from "node-email-reply-parser";
import { getSignature } from "email-signature-detector";
import { AddressObject } from "mailparser";
import { commonWords } from "./common-words";

export const smartTokensFromText = async (
  text: string,
  from: AddressObject
) => {
  // Remove signature
  const { bodyNoSig } = getSignature(
    text,
    {
      email: from.value[0].address,
      displayName: from.value[0].name,
    },
    true
  );

  // Divide paragraph into lines and remove empty lines
  const paragraphs = (parseReply(bodyNoSig || text).getVisibleText() || text)
    .split("\n")
    .filter((i: string) => i.trim())
    .map((i: string) => i.toLowerCase());

  // Tokenize each line to a sentence
  const tokens: string[] = [];
  paragraphs.forEach((paragraph: string) => {
    if (paragraph) {
      let line = [paragraph];
      try {
        line = tokenizer.tokenize(paragraph);
      } catch (error) {}
      const result = line
        .filter((i) => (i.match(/ /g) || []).length > 2)
        .map((i) => {
          commonWords.forEach((word) => (i = i.replace(word, "")));
          return i.replace(/[.,!?;]/g, "").trim();
        })
        .filter((i) => i.trim());
      tokens.push(...result);
    }
  });

  return tokens;
};
