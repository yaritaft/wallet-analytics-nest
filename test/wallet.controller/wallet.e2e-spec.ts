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
  let token: string | undefined;

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

  beforeEach(async () => {
    await request(app.getHttpServer())
      .post('/api/register')
      .send({ username: 'yari', password: '123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: 'yari', password: '123' })
      .then((res) => {
        token = res.body;
      });
  });

  it('/api/login (Post)', async () => {
    await request(app.getHttpServer())
      .get('/api/exchange-rates')
      .set('token', token)
      .expect(201);
  });
});
