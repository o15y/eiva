import AWS from "aws-sdk";
import { mkdirp, readFile, writeFile } from "fs-extra";
import { join } from "path";

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const S3_REGION = process.env.S3_REGION || "";

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  region: S3_REGION,
});

export const getS3Item = async (bucketName: string, objectId: string) => {
  const KEY = `${bucketName}${objectId}.txt`;
  if (process.env.NODE_ENV === "development") {
    try {
      const file = await readFile(join(".", ".cache", KEY));
      if (file) return file;
    } catch (error) {}
  }
  const result = await safeGetS3Item(bucketName, objectId);
  if (process.env.NODE_ENV === "development") {
    await mkdirp(join(".", ".cache"));
    await writeFile(join(".", ".cache", KEY), result.toString());
  }
  return result;
};

const safeGetS3Item = (bucketName: string, objectId: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucketName,
        Key: objectId,
      },
      (error, data) => {
        if (error) return reject(error);
        if (data.Body) return resolve(Buffer.from(data.Body));
        reject("Object is empty");
      }
    );
  });
