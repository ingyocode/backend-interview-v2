import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserInfoRequestBodyDto {
  @ApiProperty({
    description: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password'
  })
  @IsString()
  password: string;
}