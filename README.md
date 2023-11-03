## Asque Media

Asque is an e-commerce/media gallery for african art enthusiasts to explore, shop and earn while promoting African visual art and their crafts.

## Problem Statement

Though significantly ingenious, African fine artists and photographers often struggle with penetrating overseas markets. Locally, they are equally challenged with identifying their target market and effectively positioning themselves to reach them. We are out to right these.

## Target Niche

African Americans, post first generation immigrants, and everone with a demonstrated history of interest in African art and culture

## Requirements

- [Nodejs](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Nestjs](https://nestjs.com/) is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Typescript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Prisma](https://www.prisma.io/) easy to integrate into your framework of choice, Prisma simplifies database access, saves repetitive CRUD boilerplate and increases type safety. Its the perfect companion for building production-grade, robust and scalable web applications.
- [Postgres](https://www.postgresql.org/) is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.

## Todo

- Use transactions for database operations
- update route to get all art in a category so that it returns more data about the particular artwork to the client. consider updating the artwork_category schema table
- refactor code to use aws s3 to upload pictures instead of cloudinary
- refresh access token endpoint now giving authorized access token

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
