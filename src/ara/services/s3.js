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
exports.getS3Item = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const S3_REGION = process.env.S3_REGION || "";
const s3 = new aws_sdk_1.default.S3({
    apiVersion: "2006-03-01",
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_REGION,
});
exports.getS3Item = (bucketName, objectId) => __awaiter(void 0, void 0, void 0, function* () {
    const KEY = `${bucketName}${objectId}.txt`;
    if (process.env.NODE_ENV === "development") {
        try {
            const file = yield fs_extra_1.readFile(path_1.join(".", ".cache", KEY));
            if (file)
                return file;
        }
        catch (error) { }
    }
    const result = yield safeGetS3Item(bucketName, objectId);
    if (process.env.NODE_ENV === "development") {
        yield fs_extra_1.mkdirp(path_1.join(".", ".cache"));
        yield fs_extra_1.writeFile(path_1.join(".", ".cache", KEY), result.toString());
    }
    return result;
});
const safeGetS3Item = (bucketName, objectId) => new Promise((resolve, reject) => {
    s3.getObject({
        Bucket: bucketName,
        Key: objectId,
    }, (error, data) => {
        if (error)
            return reject(error);
        if (data.Body)
            return resolve(Buffer.from(data.Body));
        reject("Object is empty");
    });
});
//# sourceMappingURL=s3.js.map