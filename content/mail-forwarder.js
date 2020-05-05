const https = require("https");

exports.handler = (event) =>
  new Promise((resolve) => {
    if (
      !event.Records.length ||
      !event.Records[0].s3 ||
      !event.Records[0].s3.object ||
      !event.Records[0].s3.object.key
    ) {
      console.error("ERROR", "Did not get an S3 record");
      return resolve({
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Did not get an S3 record",
        }),
      });
    }
    const key = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );
    const req = https.request(
      {
        hostname: "api.araassistant.com",
        port: 443,
        path: "/v1/webhooks/inbound/email/" + key,
        method: "GET",
        headers: {
          Authorization: "Bearer ACCESS_TOKEN",
        },
      },
      (res) => {
        res.on("end", () => {
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              key,
            }),
          });
        });
      }
    );
    req.on("error", (error) => {
      console.error("ERROR", error);
      resolve({
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "An error occurred in making the webhook request",
        }),
      });
    });
    req.end();
  });
