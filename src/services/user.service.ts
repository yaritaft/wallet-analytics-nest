import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  checkSameHashedPassword,
  encodedPassword,
} from '../core/passwordHandler';
import { ExchangeRate } from '../entities/exchangeRate.entity';
import { User } from '../entities/user.entity';
import {
  validateToken,
  validateUser,
  validateExistingUser,
  validateUsername,
} from '../utils/validators';

export interface Credentials {
  username: string;
  password: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ username });
    validateExistingUser(user, this.logger);
    validateUsername(username, this.logger);
    const { passwordHash, salt } = await encodedPassword(password);
    const exchangeRate = await this.exchangeRateRepository.save({
      ETHToUSD: 2950,
      ETHToEuro: 2660,
    });
    await this.userRepository.save({
      username,
      passwordHash,
      salt,
      exchangeRate,
    });
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ username });
    if (!checkSameHashedPassword(password, user)) {
      this.logger.error(
        `Credentials not valid, username: ${username} password: ${password}`,
      );
      throw new Error('Credentials not valid');
    }
    if (user.token) {
      this.logger.log(`User already has generated token: ${user.token}`);
      return user.token;
    }
    const token = uuidv4();
    await this.userRepository.save({ ...user, token });
    this.logger.log(`User has generated new token: ${token}`);
    return token;
  }

  async logout(token: string): Promise<void> {
    validateToken(token, this.logger);
    const user = await this.userRepository.findOne({ token });
    validateUser(user, this.logger);
    await this.userRepository.save({ ...user, token: null });
    this.logger.log(`User ${user.username} has wiped it's token.`);
  }
}
