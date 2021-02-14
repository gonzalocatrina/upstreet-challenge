## Description

Upstreet Challenge

URL: https://drive.google.com/file/d/1GiEJK3KYAMW3y6stxZyZn5diGvxBZzjZ/view

## Before installation make sure to create the correct .env file with the next properties

```bash
#  Just for the testing I added the .production.env config:

# Production .env:
PORT=3000

# API KEYS

API_KEY=03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf
API_URL=https://australia-southeast1-reporting-290bc.cloudfunctions.net/driverlicence
```

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