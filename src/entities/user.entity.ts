import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { ExchangeRate } from './exchangeRate.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  token: string | null;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  salt: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToOne(() => ExchangeRate)
  @JoinColumn()
  exchangeRate: ExchangeRate;
}
