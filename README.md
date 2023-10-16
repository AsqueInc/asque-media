## Asque Media

## Requirements

- [Nodejs](https://nodejs.org/en/) is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Nestjs](https://nestjs.com/) is a progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Typescript](https://www.typescriptlang.org/) is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Prisma](https://www.prisma.io/) easy to integrate into your framework of choice, Prisma simplifies database access, saves repetitive CRUD boilerplate and increases type safety. Its the perfect companion for building production-grade, robust and scalable web applications.
- [Postgres](https://www.postgresql.org/) is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.

## Todo

- Ensure only owners can access or create or update their profile
- create functionality for uploading pictures and or media
- Use transactions for routes that interact with otp table
- add route to upload profile
- update route to get all art in a category so that it returns more data about the particular artwork to the client. consider updating the artwork_category schema table

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
