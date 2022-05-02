import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../entities/exchangeRate.entity';
import { User } from '../entities/user.entity';
import { validateToken, validateUser } from '../utils/validators';

export interface ExchangeRatePayload {
  ETHToUSD: number;
  ETHToEuro: number;
}

@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getExchangeRate(token: string): Promise<ExchangeRate> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({
      relations: ['exchangeRate'],
      where: { token },
    });
    validateUser(user, this.logger);
    const exchangeRate = await this.exchangeRateRepository.findOne({
      id: user.exchangeRate.id,
    });
    this.logger.log(`Exchange rate found ${JSON.stringify(exchangeRate)}`);
    return exchangeRate;
  }

  async updateExchangeRate(
    token: string,
    exchangeRatePayload: ExchangeRatePayload,
  ): Promise<void> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({
      relations: ['exchangeRate'],
      where: { token },
    });
    validateUser(user, this.logger);
    const exchangeRate = await this.exchangeRateRepository.findOne({
      id: user.exchangeRate.id,
    });
    this.logger.log(`Exchange rate found ${JSON.stringify(exchangeRate)}`);
    await this.exchangeRateRepository.save({
      ...exchangeRate,
      ...exchangeRatePayload,
    });
    this.logger.log(`Exchange rate from ${user.username} was updated.`);
  }
}
