# ✉️ Ara

Ara is an AI-powered email communication assistant. This repo contains the backend APIs, based on [staart/api](https://github.com/staart/api).

[![GitHub Actions](https://github.com/o15y/ara/workflows/Node%20CI/badge.svg)](https://github.com/o15y/ara/actions) [![Dependencies](https://img.shields.io/david/staart/api.svg)](https://david-dm.org/staart/api) [![Dev dependencies](https://img.shields.io/david/dev/staart/api.svg)](https://david-dm.org/staart/api) ![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/staart/api.svg) ![Type definitions](https://img.shields.io/badge/types-TypeScript-blue.svg)

## APIs

Apart from [Staart API](https://staart.js.org/api) endpoints that let you create and manage accounts and billing, Ara also has some email communication-specific APIs that developers can use:

- `POST /v1/api/classify` classifies text into actions
- `POST /v1/api/parse-email` parses a raw email into structured data
- `POST /v1/api/smart-tokenize` tokenizes text to actionable sentences

All API endpoints require an API key or access token; both can be generated using APIs or the [webapp](https://araassistant.com). Parameters are available in [`api/index.ts`](/src/controllers/api/index.ts).

## 📄 License

- Code: [Server Side Public License](./LICENSE)
- Logo and assets: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- [GeoNames](http://www.geonames.org/): [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)
