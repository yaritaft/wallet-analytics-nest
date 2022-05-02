import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { ExchangeRate } from '../../src/entities/exchangeRate.entity';
import { Wallet } from '../../src/entities/wallet.entity';
import { clearDB, getConnection } from '../helper';

describe('WalletController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection | void;

  afterEach(async () => {
    await clearDB(connection);
  });

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    connection = await getConnection();
  });

  afterAll((done) => {
    if (connection) {
      connection.close().then(() => app.close());
    }
    done();
  });

  it('/api/login (Post)', async () => {
    await request(app.getHttpServer())
      .post('/api/register')
      .send({ username: 'yari', password: '123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: 'yari', password: '123' })
      .expect(201);
  });

  it('/api/register (Post)', async () => {
    return await request(app.getHttpServer())
      .post('/api/register')
      .send({ username: 'yari', password: '123' })
      .expect(201);
  });

  it('/api/logout (Patch)', async () => {
    await request(app.getHttpServer())
      .post('/api/register')
      .send({ username: 'yari', password: '123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: 'yari', password: '123' })
      .expect(201);
    await request(app.getHttpServer())
      .patch('/api/logout')
      .set('token', 'TOKENVALUE') // TODO: SEE HOW TO GET TOKEN VALUE, MAY BE BY DB OR BY TAKEN REQ RESPONSE
      .expect(201);
  });
});
