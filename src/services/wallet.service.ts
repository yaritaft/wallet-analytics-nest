import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { ExchangeRateService } from './exchangeRate.service';
import { ETHBalance, getEtherBalances } from '../externalAPIs/etherscan';
import {
  validateToken,
  validateUser,
  validateWallet,
} from '../utils/validators';

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

const sortWalletsByFavorite = (wallets: WalletResponse[]): void => {
  const sortByTrueValue = (x: WalletResponse, y: WalletResponse) =>
    x.favorite === y.favorite ? 0 : x.favorite ? -1 : 1;
  wallets.sort(sortByTrueValue);
};

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @Inject(ExchangeRateService)
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async getWallets(token: string): Promise<Wallets> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({ token });
    validateUser(user, this.logger);
    const rawWallets = await this.walletRepository.find({ user });
    const updatedWallets = await getEtherBalances(rawWallets);
    const exchangeRate = await this.exchangeRateService.getExchangeRate(token);
    const convertedUpdatedWallets = updatedWallets.map((wallet) => ({
      ...wallet,
      euroBalance: Number(wallet.balance) * exchangeRate.ETHToEuro,
      dolarBalance: Number(wallet.balance) * exchangeRate.ETHToUSD,
    }));
    sortWalletsByFavorite(convertedUpdatedWallets);
    this.logger.log(`Wallets found: ${convertedUpdatedWallets.length}.`);
    return { wallets: convertedUpdatedWallets };
  }

  async storeWallet(token: string, address: string): Promise<void> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({ token });
    validateUser(user, this.logger);
    await this.walletRepository.save({ address, user, favorite: false });
    this.logger.log(`Wallet address: ${address} was saved.`);
  }

  async setFavoriteWallet(token: string, address: string): Promise<void> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({ token });
    validateUser(user, this.logger);
    const wallet = await this.walletRepository.findOne({ address, user });
    validateWallet(wallet, this.logger);
    await this.walletRepository.save({ ...wallet, favorite: !wallet.favorite });
    this.logger.log(`Wallet address: ${address} has favorite value switched.`);
  }

  async deleteWallet(token, address: string): Promise<void> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({ token });
    validateUser(user, this.logger);
    const wallet = await this.walletRepository.findOne({ address, user });
    validateWallet(wallet, this.logger);
    await this.walletRepository.delete({ id: wallet.id });
    this.logger.log(`Wallet address: ${address} has been deleted.`);
  }
}
