import natural from "natural";
const tokenizer = new (natural as any).SentenceTokenizer() as natural.WordTokenizer;

export const smartTokensFromText = async (text: string) => {
  const tokens = tokenizer.tokenize(text);
  console.log(tokens);
  return tokens;
};
