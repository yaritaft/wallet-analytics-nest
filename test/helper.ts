import * as request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { ExchangeRate } from '../src/entities/exchangeRate.entity';
import { Wallet } from '../src/entities/wallet.entity';

export const clearDB = async (connection: Connection | void) => {
  if (connection) {
    await connection.dropDatabase();
    await connection.synchronize();
  }
};

export const getConnection = async () => {
  return await createConnection({
    name: 'default2', // TODO: it has to be possible to get default connection from app object
    database: 'mydatabase',
    username: 'postgres',
    password: '123456789',
    port: 5432,
    synchronize: true,
    type: 'postgres',
    url: process.env.DATABASE_URL || process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? true : false,
    entities: [User, ExchangeRate, Wallet],
  });
};

export const printInTest = (
  res: request.Response,
  statusCode: number,
  error: boolean,
) => {
  if (error ? res.status !== statusCode : res.status === statusCode) {
    console.log(JSON.stringify(res, null, 2));
  }
};
