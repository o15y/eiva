"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyTokens = void 0;
const natural_1 = require("natural");
const training_data_1 = require("./training-data");
const classifier = new natural_1.BayesClassifier();
Object.entries(training_data_1.LABELS).forEach((values) => {
    const label = values[0];
    const data = values[1];
    data.forEach((i) => classifier.addDocument(i, label));
});
classifier.train();
const classifyLine = (line) => classifier.getClassifications(line);
exports.classifyTokens = (lines, log) => {
    const scores = {};
    Object.keys(training_data_1.LABELS).forEach((key) => {
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
//# sourceMappingURL=classify.js.map