import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfoRequestBodyDto } from './dtos/users.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({
    summary: 'sign in',
    description: 'sign in user'
  })
  @ApiOkResponse({
    type: String
  })
  @Post('sign-in')
  async signInUser(
    @Body() body: UserInfoRequestBodyDto
  ): Promise<string> {
    const existedUser = await this.usersService.getUser(body.email);
    if (!existedUser) {
      throw new HttpException('Invalid email or password', 400);
    }

    const userPasswordInfo = this.usersService.hashPassword(body.password, existedUser.salt);
    if (userPasswordInfo.password !== existedUser.password) {
      throw new HttpException('Invalid email or password', 400);
    }

    return this.authService.generateToken(existedUser.id, existedUser.email);
  }

  @ApiOperation({
    summary: 'sign up',
    description: 'create user'
  })
  @Post('sign-up')
  @ApiOkResponse({
    type: String
  })
  async createUser(
    @Body() body: UserInfoRequestBodyDto
  ): Promise<string> {
    const existedUser = await this.usersService.getUser(body.email);
    if (existedUser) {
      throw new HttpException('already sign up user', 400);
    }

    const user = await this.usersService.createUser(body.email, body.password);
    return this.authService.generateToken(user.id, user.email);
  }
}