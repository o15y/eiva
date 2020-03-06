import natural from "natural";
const tokenizer = new (natural as any).SentenceTokenizer() as natural.WordTokenizer;

export const smartTokensFromText = async (text: string) => {
  // Divide paragraph into lines and remove empty lines
  const paragraphs = text.split("\n").filter(i => i.trim());

  // Tokenize each line to a sentence
  const tokens: string[][] = [];
  paragraphs.forEach(paragraph => tokens.push(tokenizer.tokenize(paragraph)));

  console.log(tokens);
  return tokens;
};
