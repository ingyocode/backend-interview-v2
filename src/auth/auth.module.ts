import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET')
          })
        }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
