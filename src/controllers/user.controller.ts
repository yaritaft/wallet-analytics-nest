import { Headers, Controller, Patch, Post, Body } from '@nestjs/common';
import { UserService, Credentials } from '../services/user.service';

interface Token {
  token: string;
}

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() { username, password }: Credentials): Promise<void> {
    return this.userService.register(username, password);
  }

  @Post('/login')
  async login(@Body() { username, password }: Credentials): Promise<string> {
    return this.userService.login(username, password);
  }

  @Patch('/logout')
  async logout(@Headers() headers: Token): Promise<void> {
    return await this.userService.logout(headers.token);
  }
}
