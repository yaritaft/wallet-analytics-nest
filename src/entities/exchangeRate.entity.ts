import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float8' })
  ETHToUSD: number;

  @Column({ type: 'float8' })
  ETHToEuro: number;
}
