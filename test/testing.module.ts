import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
})
export class TestingModule {
  constructor() {}
}
