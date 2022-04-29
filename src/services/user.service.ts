import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  checkSameHashedPassword,
  encodedPassword,
} from '../core/passwordHandler';
import { ExchangeRate } from '../entities/exchangeRate.entity';
import { User } from '../entities/user.entity';

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

const validateExistingUser = (user: User): void => {
  if (user) {
    throw new Error('The user name already exists in db.');
  }
};

const validateUsername = (username: string): void => {
  if (!username) {
    throw new Error('Not valid username.');
  }
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ username });
    validateExistingUser(user);
    validateUsername(username);
    const { passwordHash, salt } = await encodedPassword(password);
    const exchangeRate = await this.exchangeRateRepository.save({
      ETHToUSD: 99,
      ETHToEuro: 188,
    }); // TODO: HERE TAKE THE CURRENT VALUE OF EXCHANGED RATES
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
      throw new Error('Credentials not valid');
    }
    if (user.token) {
      return user.token;
    }
    const token = uuidv4();
    await this.userRepository.save({ ...user, token });
    return token;
  }

  async logout(token: string): Promise<void> {
    validateToken(token);
    const user = await this.userRepository.findOne({ token });
    validateUser(user);
    await this.userRepository.save({ ...user, token: null });
  }
}
