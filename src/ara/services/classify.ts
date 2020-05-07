import { BayesClassifier } from "natural";
import { LABELS } from "./training-data";
import { Logger } from "../interfaces";

const classifier = new BayesClassifier();
Object.entries(LABELS).forEach((values) => {
  const label = values[0];
  const data = values[1];
  data.forEach((i) => classifier.addDocument(i, label));
});
classifier.train();

const classifyLine = (line: string) => classifier.getClassifications(line);

export const classifyTokens = (lines: string[], log: Logger) => {
  const scores: { [index: string]: number } = {};
  Object.keys(LABELS).forEach((key) => {
    scores[key] = 0;
  });
  lines.forEach((line) => {
    const results = classifyLine(line);
    results.forEach((result) => {
      scores[result.label] += result.value;
    });
  });
  log("Classifications", scores);
  return Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
};
