# Digital Wallet Dashboard

## Objective

Build a generic platform that return analytics on an ethereum wallets.

## Requirements

The application have the following requirements:

1. Add wallet addresses and display them
2. From the set of wallets, the user should be able toselect favorites and order by them
3. We should have a way to know if a wallet is old. Awallet is considered old if the firsttransaction was performed at least one year ago.
4. The user should be able to do the following actions

- Get exchange rates from Euro and US Dollar to ETH(Ethereum), those can bestored in-memory or in any DB of your preference.
- Edit the exchange rate of Euro or US Dollar to ETH.

5.  Given a currency (Euro or US Dollar) then theuser should have the balance of the ETHin the wallet in the selected currency using the exchangerates from step 4.

## For API

- You should use NestJS
- You can store data in memory, but a DB is a must be.

### For UI

Implement for above endpoints a dashboard interface (React / VueJs) using the attached designs.
Use redux/vuex if necessary. Please note: You can add things to the design if required.

### UI Design

![](https://raw.githubusercontent.com/yaritaft/wallet-analytics-nest/master/doc/ui-design2.png)

# Solution

## Technologies

- NestJS
- Typescript
- TypeOrm
- Postgres

## Pre Requisites

- Bash terminal
- Docker and docker-compose installed and working without sudo

## Run the app and db

1. Create a .env file inside root folder. With following variables and of course using the real api key.

```
DATABASE_URL=postgresql://postgres:123456789@localhost:5432/mydatabase?sslmode=disable
ETH_API_KEY=API_KEY_HERE
ETH_API_URL=https://api.etherscan.io/api
```

Once that is done then run.

```
docker-compose up
```

## Run db and debug app

```
docker-compose up db
```

In other terminal inside root folder and with Node 14 installed execute

```
npm install
```

And press F5 in visual studio code. That will run the app in debug mode.

## End to End Testing

```
docker-compose up db
```

In other terminal inside root folder and with Node 14 installed execute

```
npm run test:e2e
```

End to end tests will be run with supertest. Otherwise you there's a Postman collection created in postman folder. It is possible to import it and test from that place the backend.

## Assumptions

- The sorting is first favorites wallets and then non favorite ones.
- We need a register and log in module to support multiple accounts.
- We are only getting exchange rate by manual input of the user. Although a default value is assigned when user is created.

## Decisions

- Postgres SQL and TypeORM: Since we have information that is related to multiple instances and SQL database was choosen. Also TypeORM was used because of it's integration with nest and because it is the most standard ORM technology. And also allows to use SQL database as a repository like mongo db.
- Splitted logic in the architecture: We have core logic. Services. Controllers and entities. Every is fully injectable to allow easier unit test if it is needed.
- External API calls was written in a different file to decoupple the code from the external api. We rely on interfaces and not in classes or implementations.
- The whole application was dockerized for environment reproducibility purposes.

## Improvement areas

- A request layer would be useful to decoupple requests from axios.
- Separated entities would be better instead of merging domain models with entities by using decorators.
- It would be nice to have a mono repo to share domain models since we are using Typescript end to end.
- JSON Schema validators could have been used to improve error handling related to invalid requests. I.E using Yup.
- And extra security step of checking if the wallet exists before storing it in db.
- Unit testing could have been used to test business logic in some complex cases.

## How to use the postman collection

1. Import the collection.
2. Create your account.
3. Login. Once you have the token store it in token env variable inside postman.
4. Once you have that you are able to use all requests in the collection.
