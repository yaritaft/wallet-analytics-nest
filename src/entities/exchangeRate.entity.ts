import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ETHToUSD: number;

  @Column()
  ETHToEuro: number;
}
