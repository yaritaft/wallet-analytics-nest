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
  WalletService,
  WalletCreation,
  Wallets,
} from '../services/wallet.service';

interface Token {
  token: string;
}

@Controller('/api')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/wallets')
  async getWallets(@Headers() headers: Token): Promise<Wallets> {
    return await this.walletService.getWallets(headers.token);
  }

  @Post('/wallets')
  async storeWallet(
    @Headers() headers: Token,
    @Body() walletCreation: WalletCreation,
  ): Promise<void> {
    return await this.walletService.storeWallet(
      headers.token,
      walletCreation.address,
    );
  }

  @Patch('/wallets/:addressId/favorite')
  async setFavoriteWallet(
    @Headers() headers: Token,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    return await this.walletService.setFavoriteWallet(headers.token, addressId);
  }

  @Delete('/wallets/:addressId')
  async deleteWallet(
    @Headers() headers: Token,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    return await this.walletService.deleteWallet(headers.token, addressId);
  }
}
