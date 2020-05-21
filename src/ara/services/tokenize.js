"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartTokensFromText = void 0;
const natural_1 = __importDefault(require("natural"));
const tokenizer = new natural_1.default.SentenceTokenizer();
const node_email_reply_parser_1 = __importDefault(require("node-email-reply-parser"));
const email_signature_detector_1 = require("email-signature-detector");
const common_words_1 = require("./common-words");
exports.smartTokensFromText = (text, from) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove signature
    const { bodyNoSig } = email_signature_detector_1.getSignature(text, {
        email: from.value[0].address,
        displayName: from.value[0].name
    }, true);
    // Divide paragraph into lines and remove empty lines
    const paragraphs = (node_email_reply_parser_1.default(bodyNoSig || text).getVisibleText() || text)
        .split("\n")
        .filter(i => i.trim())
        .map(i => i.toLowerCase());
    // Tokenize each line to a sentence
    const tokens = [];
    paragraphs.forEach(paragraph => {
        if (paragraph) {
            let line = [paragraph];
            try {
                line = tokenizer.tokenize(paragraph);
            }
            catch (error) { }
            const result = line
                .filter(i => (i.match(/ /g) || []).length > 2)
                .map(i => {
                common_words_1.commonWords.forEach(word => (i = i.replace(word, "")));
                return i.replace(/[.,!?:;]/g, "").trim();
            })
                .filter(i => i.trim());
            tokens.push(...result);
        }
    });
    return tokens;
});
//# sourceMappingURL=tokenize.js.map