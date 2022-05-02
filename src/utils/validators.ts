import { Logger } from '@nestjs/common';
import { Wallet } from 'src/entities/wallet.entity';
import { User } from '../entities/user.entity';

export const validateUser = (user: User, logger: Logger): void => {
  if (!user) {
    logger.error(`No user was found. With this token`);
    throw new Error('No user was found. With this token');
  }
  logger.log(`User found ${user.id}`);
};

export const validateToken = (token: string, logger: Logger): void => {
  if (!token) {
    logger.error(`Not valid token.`);
    throw new Error('Not valid token.');
  }
};

export const validateExistingUser = (user: User, logger: Logger): void => {
  if (user) {
    throw new Error('The user name already exists in db.');
  }
};

export const validateUsername = (username: string, logger: Logger): void => {
  if (!username) {
    throw new Error('Not valid username.');
  }
};

export const validateWallet = (wallet: Wallet, logger: Logger): void => {
  if (!wallet) {
    throw new Error('No wallet was found. With this token');
  }
  logger.log(`Wallet found ${wallet.address} .`);
};
