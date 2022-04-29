import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';

export interface Wallets {
  wallets: Wallet[];
}

export interface ExchangeRatePayload {
  ETHToUSD: number;
  ETHToEuro: number;
}

export interface WalletCreation {
  address: string;
}

export interface Credentials {
  username: string;
  password: string;
}

const validateToken = (token: string): void => {
  if (!token) {
    throw new Error('Not valid token.');
  }
};

const validateUser = (user: User): void => {
  if (!user) {
    throw new Error('No user was found. With this token');
  }
};

const validateWallet = (wallet: Wallet): void => {
  if (!wallet) {
    throw new Error('No wallet was found. With this token');
  }
};

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async getWallets(token: string): Promise<Wallets> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    const wallets = await this.walletRepository.find({ user });
    return { wallets };
  }

  async storeWallet(token: string, address: string): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    await this.walletRepository.save({ address, user, favorite: false });
    validateUser(user);
  }

  async setFavoriteWallet(token: string, address: string): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    const wallet = await this.walletRepository.findOne({ address, user });
    validateWallet(wallet);
    this.walletRepository.save({ ...wallet, favorite: !wallet.favorite });
  }

  async deleteWallet(token, address: string): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    const wallet = await this.walletRepository.findOne({ address, user });
    validateWallet(wallet);
    await this.walletRepository.delete({ id: wallet.id });
  }
}
