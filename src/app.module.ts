import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ExchangeRate } from './entities/exchangeRate.entity';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { ExchangeRateController } from './controllers/exchangeRate.controller';
import { UserController } from './controllers/user.controller';
import { WalletController } from './controllers/wallet.controller';
import { ExchangeRateService } from './services/exchangeRate.service';
import { UserService } from './services/user.service';
import { WalletService } from './services/wallet.service';
import { ConfigModule } from '@nestjs/config';

const rootDir = __dirname;

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      name: 'default',
      database: 'mydatabase',
      username: 'postgres',
      password: '123456789',
      port: 5432,
      synchronize: true,
      type: 'postgres',
      url: process.env.DATABASE_URL || process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL ? true : false, // If env var is not set then it is dev
      entities: [`${rootDir}/**/*.entity.js`, `${rootDir}/**/*.entity.{ts,js}`],
    }),
    TypeOrmModule.forFeature([ExchangeRate, User, Wallet]),
  ],
  controllers: [WalletController, UserController, ExchangeRateController],
  providers: [WalletService, UserService, ExchangeRateService],
})
export class AppModule {}
