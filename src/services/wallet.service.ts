import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getEtherBalances } from 'src/externalAPIs/etherscan';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { ExchangeRateService } from './exchangeRate.service';
import { ETHBalance } from '../externalAPIs/etherscan';

export interface Wallets {
  wallets: WalletResponse[];
}

export interface WalletResponse extends ETHBalance {
  euroBalance: number;
  dolarBalance: number;
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

const sortWalletsByFavorite = (wallets: WalletResponse[]): void => {
  const sortByTrueValue = (x: WalletResponse, y: WalletResponse) =>
    x.favorite === y.favorite ? 0 : x.favorite ? -1 : 1;
  wallets.sort(sortByTrueValue);
};

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @Inject(ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async getWallets(token: string): Promise<Wallets> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    const rawWallets = await this.walletRepository.find({ user });
    const updatedWallets = await getEtherBalances(rawWallets);
    const exchangeRate = await this.exchangeRateService.getExchangeRate(token);
    const convertedUpdatedWallets = updatedWallets.map((wallet) => ({
      ...wallet,
      euroBalance: Number(wallet.balance) * exchangeRate.ETHToEuro,
      dolarBalance: Number(wallet.balance) * exchangeRate.ETHToUSD,
    }));
    sortWalletsByFavorite(convertedUpdatedWallets);
    return { wallets: convertedUpdatedWallets };
  }

  async storeWallet(token: string, address: string): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    await this.walletRepository.save({ address, user, favorite: false });
  }

  async setFavoriteWallet(token: string, address: string): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    const wallet = await this.walletRepository.findOne({ address, user });
    validateWallet(wallet);
    await this.walletRepository.save({ ...wallet, favorite: !wallet.favorite });
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
