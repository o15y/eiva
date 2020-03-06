import AWS from "aws-sdk";

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";

AWS.config.update({
  region: "REGION",
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
