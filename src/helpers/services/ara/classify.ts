import { BayesClassifier } from "natural";
import {
  setupNewAppointment,
  rescheduleAppointment,
  cancelAppointment,
  scheduleSummary
} from "./training-data";
import { Logger } from "../../../interfaces/ara";

const classifier = new BayesClassifier();
Object.entries({
  setupNewAppointment,
  rescheduleAppointment,
  cancelAppointment,
  scheduleSummary
}).forEach(values => {
  const label = values[0];
  const data = values[1];
  data.forEach(i => classifier.addDocument(i, label));
});
classifier.train();

const classifyLine = (line: string) => classifier.getClassifications(line);

export const classifyTokens = (lines: string[], log: Logger) => {
  let maxScore = 0;
  let maxScoreClassification = "";
  lines.forEach(line => {
    const results = classifyLine(line);
    let localMaxScore = 0;
    let localMaxScoreClassification: string | null = null;
    results.forEach(result => {
      if (result.value > localMaxScore) {
        localMaxScore = result.value;
        localMaxScoreClassification = result.label;
      }
    });
    if (localMaxScore > maxScore && localMaxScoreClassification) {
      maxScore = localMaxScore;
      maxScoreClassification = localMaxScoreClassification;
    }
    if (maxScoreClassification) {
      log(
        `Classification for "${line}" is "${maxScoreClassification}" (${maxScore})`
      );
    }
  });
  if (!maxScoreClassification) throw new Error("Unable to classify email");
  return maxScoreClassification;
};
