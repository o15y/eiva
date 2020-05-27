# ✉️ Ara

Ara is an AI-powered email communication assistant. This repo contains the backend APIs, based on [staart/api](https://github.com/staart/api).

[![GitHub Actions](https://github.com/o15y/ara/workflows/Deploy%20CI/badge.svg)](https://github.com/o15y/ara/actions) [![Dependencies](https://img.shields.io/david/staart/api.svg)](https://david-dm.org/staart/api) [![Dev dependencies](https://img.shields.io/david/dev/staart/api.svg)](https://david-dm.org/staart/api) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/staart/api.svg) ![Type definitions](https://img.shields.io/badge/types-TypeScript-blue.svg)

**Production API base URL: https://eiva-api.o15y.com**

## APIs

Apart from [Staart API](https://staart.js.org/api) endpoints that let you create and manage accounts and billing, Ara also has some email communication-specific APIs that developers can use:

- `POST /v1/api/classify` classifies text into actions
- `POST /v1/api/parse-email` parses a raw email into structured data
- `POST /v1/api/smart-tokenize` tokenizes text to actionable sentences
- `POST /v1/api/perform-action` takes an email and processes it
- `POST /v1/api/read-receipt` saves a read receipt for an email
- `POST /v1/api/meeting-page/:username/:id` returns public meeting details
- `POST /v1/api/confirm-meeting/:organizaionId/:meetingId` confirms a meeting
- `POST /v1/api/track/:index` tracks a usage event

CRUD endpoints:

- `/v1/organizations/:id/location`
- `/v1/organizations/:id/meetings`

All API endpoints require an API key or access token; both can be generated using APIs or the [webapp](https://araassistant.com). Parameters are available in [`api/index.ts`](/src/controllers/api/index.ts).

## 👩‍💻 Development

### Known issues

_**⚠️ FIX AVAILABLE:** The fix for this is available in Prisma beta 5_

`String` in Prisma schema doesn't allow larger fields, so you have to manually convert the following fields to `LONGTEXT` from `VARCHAR` after generating tables. For details, see [prisma/migrate#116](https://github.com/prisma/migrate/issues/116)

- `"incoming-emails".from`
- `"incoming-emails".to`
- `"incoming-emails".cc`
- `"incoming-emails".logs`
- `locations.data`
- `meetings.proposedTimes`
- `meetings.guests`

You might also have to make some of these changes after running `npx prisma migrate up --experimental` because it would overwrite the database schema.

### Differences in `_staart`

- `helpers/mail.ts` supports more parameters
- `init-tests.ts` has ===== line

### Resources

#### AWS S3 bucket

The `ara-assistant-incoming-emails` bucket is used to store incoming emails to Ara as plain text files that can be fetched and parsed by this API. It's hosted in the eu-central-1 region and has limited, non-public access. An example of such an email is available in [`content/2mgh53qnuk650do2k3qlb5pv27obrl22uga8de01`](./content/2mgh53qnuk650do2k3qlb5pv27obrl22uga8de01) and is called using /v1/api/webhooks/inbound/email/OBJECT_ID?secret=SECRET as explained below.

#### AWS Lambda function

This serverless function `EmailForwarder` in invoked from AWS S3, when a new object is added to the emails bucket. The source code is available in [`content/mail-forwarder.js`](./content/mail-forwarder.js) and is hosted in the eu-central-1 region with the Node.js 12.x runtime, 128 MB memory limit, and 1 minute execution timeout.

#### Redis

Key-value storage Redis is used for JWT cache invalidation and MySQL query caching. For production, a self-hosted Redis instance is used using Caprover, available only to other Caprover applications. For development, a local redis-server with default configuration will do.

#### Server

A dedicated server is used for deploying the EIVA service. This uses AWS Lightsail which provides an easy-to-use interface for AWS EC2.

Instance details:

- Region: Frankfurt (eu-central-1)
- RAM: 4 GB
- Processor: 2 vCPUs
- Storage: 80 GB SSD
- Public IP address: 18.195.203.61
- Billing period: May 21, 2020–_present_

#### ElasticSearch

A dedicated ElasticSearch instance is used to store server logs, and more importantly track usage events using the `/v1/api/track/:index` API endpoint. This data will be used for analytics about pages, time on site, etc.

Instance details:

- Elasticsearch version: 7.4
- Instance type: r5.large.elasticsearch
- Number of nodes: 1
- Data nodes storage type: EBS
- EBS volume type: General Purpose (SSD)
- EBS volume size: 10 GiB
- Billing period: May 21, 2020–_present_

### Environment variables

These environment variables (with the exception of `DATABASE_URL`) can be set in the `.env` file, or available as environment variables in the process using the Caprover UI or Dockerfile.

#### General @staart/api

- `PORT` is `7007` in development and `80` on production
- `BASE_URL` = https://api.araassistant.com
- `FRONTEND_URL` = https://araassistant.com
- `REDIS_URL` is `redis://:KvEqnrLZJhGGEuNHNMcgG3sH@srv-captain--redis:6379` in production and not required for development if you have a local Redis instance running using `redis-server`
- `DATABASE_URL` = `mysql://USER:PASSWORD@HOST:PORT/DATABASE` is set in `.env` in the `./prisma` dir

#### AWS SES emails

This is used for both transactional emails (like password resets) using `SES_EMAIL` and for sending emails from Ara (like `meet-anand@mail.assistant.com`)

- `SES_EMAIL` is the email to send emails from (`noreply@mail.araassistant.com`)
- `SES_REGION` is the AWS region (`us-east-1`)
- `SES_ACCESS` is the AWS access key for SES
- `SES_SECRET` is the AWS secret key for SES

#### Stripe

- `STRIPE_SECRET_KEY` is the test key for development and live key for production
- `STRIPE_PRODUCT_ID` is the product ID for Ara (`prod_HAdEYq2FQrjVSd` for testing)

#### Clearbit

Clearbit is used to find information about guests, emails, and more:

- `CLEARBIT_SECRET_KEY` is the secret API key

#### ElasticSearch

- `AWS_ELASTIC_ACCESS_KEY` is the AWS access key for ElasticSearch
- `AWS_ELASTIC_SECRET_KEY` is the AWS secret key for ElasticSearch
- `AWS_ELASTIC_HOST` is the AWS ElasticSearch endpoint

## Webhook

For incoming emails, the `/v1/webhooks/inbound/email/OBJECT_ID?secret=SECRET` URL is used. The following is a real example for the URL that will work locally:

```
http://localhost:7001/v1/webhooks/inbound/email/2mgh53qnuk650do2k3qlb5pv27obrl22uga8de01?secret=ebbb11de0c0400bf869bd48537ab56676715ec78173191ed377b0cae9a3eb6d0
```

To generate the secret, sign the object ID using HMAC with SHA-256 and the secret. The secret is stored as the environment variable `INCOMING_EMAIL_WEBHOOK_SECRET` as defined above. In Node.js, you can generate it using:

```js
const { createHmac } = require("crypto");
createHmac("sha256", INCOMING_EMAIL_WEBHOOK_SECRET)
  .update(objectId)
  .digest("hex");
```

## 📄 License

- Code: [Server Side Public License](./LICENSE)
- Logo and assets: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [GeoNames](http://www.geonames.org/): [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
