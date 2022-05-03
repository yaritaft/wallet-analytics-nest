import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { ExchangeRate } from '../../src/entities/exchangeRate.entity';
import { Wallet } from '../../src/entities/wallet.entity';
import { clearDB, getConnection, printInTest } from '../helper';
import assert from 'assert';

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
      .expect(201)
      .expect((res) => {
        printInTest(res, 201, true);
        token = res.text;
      });
    expect(token.length).toBeGreaterThan(0);
  });

  it('/api/wallets (Get)', async () => {
    await request(app.getHttpServer())
      .get('/api/wallets')
      .set('token', token)
      .expect((res) => {
        printInTest(res, 200, true);
        if (JSON.parse(res.text).wallets.length !== 0) {
          throw new Error('No wallets were loaded.');
        }
      })
      .expect(200);
  });

  it('/api/wallets (Post)', async () => {
    await request(app.getHttpServer())
      .post('/api/wallets')
      .set('token', token)
      .send({
        address: '0x198ef1ec325a96cc354c7266a038be8b5c558f67',
      })
      .expect(201);
  });

  it('/api/wallets (Get)', async () => {
    await request(app.getHttpServer())
      .post('/api/wallets')
      .set('token', token)
      .send({
        address: '0x198ef1ec325a96cc354c7266a038be8b5c558f67',
      })
      .expect(201);
    await request(app.getHttpServer())
      .get('/api/wallets')
      .set('token', token)
      .expect((res) => {
        printInTest(res, 200, true);
        if (JSON.parse(res.text).wallets.length !== 1) {
          throw new Error('One wallet must be loaded.');
        }
      })
      .expect(200);
  });

  it('/api/wallets/:addressId (Delete)', async () => {
    await request(app.getHttpServer())
      .post('/api/wallets')
      .set('token', token)
      .send({
        address: '0x198ef1ec325a96cc354c7266a038be8b5c558f67',
      })
      .expect(201);
    await request(app.getHttpServer())
      .get('/api/wallets')
      .set('token', token)
      .expect((res) => {
        printInTest(res, 200, true);
        if (JSON.parse(res.text).wallets.length !== 1) {
          throw new Error('One wallet must be loaded.');
        }
      })
      .expect(200);
    await request(app.getHttpServer())
      .delete('/api/wallets/0x198ef1ec325a96cc354c7266a038be8b5c558f67')
      .set('token', token)
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/wallets')
      .set('token', token)
      .expect((res) => {
        printInTest(res, 200, true);
        if (JSON.parse(res.text).wallets.length !== 0) {
          throw new Error('No wallets were loaded.');
        }
      })
      .expect(200);
  });

  it('/api/wallets/:addressId/favorite (Patch)', async () => {
    await request(app.getHttpServer())
      .post('/api/wallets')
      .set('token', token)
      .send({
        address: '0x198ef1ec325a96cc354c7266a038be8b5c558f67',
      })
      .expect(201);
    await request(app.getHttpServer())
      .get('/api/wallets')
      .set('token', token)
      .expect((res) => {
        printInTest(res, 200, true);
        if (JSON.parse(res.text).wallets[0].favorite !== false) {
          throw new Error('Cannot be favorite if it was recently created.');
        }
      })
      .expect(200);
    await request(app.getHttpServer())
      .patch('/api/wallets/0x198ef1ec325a96cc354c7266a038be8b5c558f67/favorite')
      .set('token', token)
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/wallets')
      .set('token', token)
      .expect((res) => {
        printInTest(res, 200, true);
        if (JSON.parse(res.text).wallets[0].favorite !== true) {
          throw new Error('Wallet was set to true value.');
        }
      })
      .expect(200);
  });
});
