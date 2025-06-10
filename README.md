# Wallet API

Backend API for managing users and their wallets

### Features

- Sign in a User
- Sign out a user

- Create new Users
- Get Users list
- Get User by ID
- Update User
- Delete User

- Get all wallets for the authenticated user
- Create a new wallet
- Get a specific wallet by ID
- Update a wallet
- Delete a wallet

## Pre-requisites
- Docker installed
- Docker compose installed
- Ports free: 3000 and 5432

## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Nahue256/WalletAPI/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/Nahue256/WalletAPI/tree/main)

[![Coverage Status](https://coveralls.io/repos/github/Nahue256/WalletAPI/badge.svg?branch=main)](https://coveralls.io/github/Nahue256/WalletAPI?branch=main)

## How to run the APP

```
chmod 711 ./up_dev.sh
./up_dev.sh
```

## How to test the API using swagger

- When the app is running, enter the API Swagger http://localhost:3000/api-docs and create an user using the POST /user route.

- Use the /signin route to authenticate with the email and password that you registered.

- Go to the wallets API routes and click in the padlock to the right of the Wallet API you want to test, and enter the token like this: "Bearer {TOKEN}".

- Test the wallets APIs.

## How to test the API using Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](./docs/postman-collection.json)

**Quick Start:** Import → Create User → Sign In → Test Endpoints

## How to run the tests

```
chmod 711 ./up_test.sh
./up_test.sh
```

## Areas to improve

- Data should be moved from tests to an external file, coverage could be better.
- Error handling could be improved.
- A Seed migration would be useful to have an already working app with data.
- The ORM is being used with Sinchronize instead of Migrations.
- Deployment could be done.
- Add request validation using libraries like joi and validate email format, password strength, etc.
- Add CSRF protection and refresh token mechanism.
- Pagination for the GET endpoints and DB indexing.

## Errors to be fixed

## Technologies used

- Node.js: 22.14.0
- Express.js: 4.18.2
- PostgreSQL
- TypeORM
- Docker

## Decisions made

- Clean Architecture: To be able to handle future changes in the future in a proper way.
- TypeORM: Because it is the most popular ORM so it is easy to find fixes and people that know how to use it.
- Docker: To make it portable
- Testing: Used Jest because is the most popular testing framework of JS. E2E Testing with a DB for testing was done because it is a good practice.

## Route

- API: http://localhost:3000/api
- API Swagger: http://localhost:3000/api-docs

# Env vars should be defined

To find an example of the values you can use .env.example