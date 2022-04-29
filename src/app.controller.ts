import {
  Headers,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import {
  AppService,
  Credentials,
  ExchangeRatePayload,
  WalletCreation,
  Wallets,
} from './app.service';
import { ExchangeRate } from './entities/exchangeRate.entity';

interface Token {
  token: string;
}

interface AddressIdPath {
  addressId: string;
}

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/exchange-rates')
  async getExchangeRate(@Headers() headers: Token): Promise<ExchangeRate> {
    return await this.appService.getExchangeRate(headers.token);
  }

  @Patch('/exchange-rates')
  async updateExchangeRate(
    @Headers() headers: Token,
    @Body() exchangeRatePayload: ExchangeRatePayload,
  ): Promise<void> {
    return this.appService.updateExchangeRate(
      headers.token,
      exchangeRatePayload,
    );
  }

  @Post('/register')
  async register(@Body() { username, password }: Credentials): Promise<void> {
    return this.appService.register(username, password);
  }

  @Post('/login')
  async login(@Body() { username, password }: Credentials): Promise<string> {
    return this.appService.login(username, password);
  }

  @Patch('/logout')
  async logout(@Headers() headers: Token): Promise<void> {
    return await this.appService.logout(headers.token);
  }

  @Get('/wallets')
  getWallets(@Headers() headers: Token): Promise<Wallets> {
    return this.appService.getWallets(headers.token);
  }

  @Post('/wallets')
  async storeWallet(
    @Headers() headers: Token,
    @Body() walletCreation: WalletCreation,
  ): Promise<void> {
    return await this.appService.storeWallet(
      headers.token,
      walletCreation.address,
    );
  }

  @Patch('/wallets/:addressId/favorite')
  async setFavoriteWallet(
    @Headers() headers: Token,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    return await this.appService.setFavoriteWallet(headers.token, addressId);
  }

  @Delete('/wallets/:addressId')
  async deleteWallet(
    @Headers() headers: Token,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    return await this.appService.deleteWallet(headers.token, addressId);
  }
}
