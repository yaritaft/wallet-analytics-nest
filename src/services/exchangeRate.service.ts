import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../entities/exchangeRate.entity';
import { User } from '../entities/user.entity';

export interface ExchangeRatePayload {
  ETHToUSD: number;
  ETHToEuro: number;
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

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getExchangeRate(token: string): Promise<ExchangeRate> {
    validateToken(token);
    const user = await this.userRepository.findOne({
      relations: ['exchangeRate'],
      where: { token },
    });
    validateUser(user);
    return await this.exchangeRateRepository.findOne({
      id: user.exchangeRate.id,
    });
  }

  async updateExchangeRate(
    token: string,
    exchangeRatePayload: ExchangeRatePayload,
  ): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({
      relations: ['exchangeRate'],
      where: { token },
    });
    validateUser(user);
    const exchangeRate = await this.exchangeRateRepository.findOne({
      id: user.exchangeRate.id,
    });
    await this.exchangeRateRepository.save({
      ...exchangeRate,
      ...exchangeRatePayload,
    });
  }
}
