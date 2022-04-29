import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeRate } from './entities/exchangeRate.entity';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';

const rootDir = __dirname;

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
