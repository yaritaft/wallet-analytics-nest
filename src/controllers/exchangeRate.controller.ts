import { Headers, Controller, Get, Patch, Body } from '@nestjs/common';
import { ExchangeRate } from '../entities/exchangeRate.entity';
import {
  ExchangeRatePayload,
  ExchangeRateService,
} from '../services/exchangeRate.service';

interface Token {
  token: string;
}

@Controller('/api')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get('/exchange-rates')
  async getExchangeRate(@Headers() headers: Token): Promise<ExchangeRate> {
    return await this.exchangeRateService.getExchangeRate(headers.token);
  }

  @Patch('/exchange-rates')
  async updateExchangeRate(
    @Headers() headers: Token,
    @Body() exchangeRatePayload: ExchangeRatePayload,
  ): Promise<void> {
    return this.exchangeRateService.updateExchangeRate(
      headers.token,
      exchangeRatePayload,
    );
  }
}
