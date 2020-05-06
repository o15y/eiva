# ✉️ Ara

Ara is an AI-powered email communication assistant. This repo contains the backend APIs, based on [staart/api](https://github.com/staart/api).

[![GitHub Actions](https://github.com/o15y/ara/workflows/Node%20CI/badge.svg)](https://github.com/o15y/ara/actions) [![Dependencies](https://img.shields.io/david/staart/api.svg)](https://david-dm.org/staart/api) [![Dev dependencies](https://img.shields.io/david/dev/staart/api.svg)](https://david-dm.org/staart/api) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/staart/api.svg) ![Type definitions](https://img.shields.io/badge/types-TypeScript-blue.svg)

## APIs

Apart from [Staart API](https://staart.js.org/api) endpoints that let you create and manage accounts and billing, Ara also has some email communication-specific APIs that developers can use:

- `POST /v1/api/classify` classifies text into actions
- `POST /v1/api/parse-email` parses a raw email into structured data
- `POST /v1/api/smart-tokenize` tokenizes text to actionable sentences
- `POST /v1/api/perform-action` takes an email and processes it

All API endpoints require an API key or access token; both can be generated using APIs or the [webapp](https://araassistant.com). Parameters are available in [`api/index.ts`](/src/controllers/api/index.ts).

## 👩‍💻 Development

### Resources

#### AWS S3 bucket

The `ara-assistant-incoming-emails` bucket is used to store incoming emails to Ara as plain text files that can be fetched and parsed by this API. It's hosted in the eu-central-1 region and has limited, non-public access. An example of such an email is available in [`content/2mgh53qnuk650do2k3qlb5pv27obrl22uga8de01`](./content/2mgh53qnuk650do2k3qlb5pv27obrl22uga8de01) and is called using /v1/api/webhooks/inbound/email/2mgh53qnuk650do2k3qlb5pv27obrl22uga8de01.

#### AWS Lambda function

This serverless function `EmailForwarder` in invoked from AWS S3, when a new object is added to the emails bucket. The source code is available in [`content/mail-forwarder.js`](./content/mail-forwarder.js) and is hosted in the eu-central-1 region with the Node.js 12.x runtime, 128 MB memory limit, and 1 minute execution timeout.

#### Redis

Key-value storage Redis is used for JWT cache invalidation and MySQL query caching. For production, a self-hosted Redis instance is used using Caprover, available only to other Caprover applications. For development, a local redis-server with default configuration will do.

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

- `SES_EMAIL` = `noreply@mail.araassistant.com`
- `SES_REGION` = `us-east-1`
- `SES_ACCESS` = API access key from AWS
- `SES_SECRET` = API secret key from AWS

#### Stripe

- `STRIPE_SECRET_KEY` is the test key for development and live key for production
- `STRIPE_PRODUCT_ID` is the product ID for Ara (`prod_HAdEYq2FQrjVSd` for testing)

## 📄 License

- Code: [Server Side Public License](./LICENSE)
- Logo and assets: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [GeoNames](http://www.geonames.org/): [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
