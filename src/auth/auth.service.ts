import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  generateToken(id: number, email: string): string {
    return this.jwtService.sign({ id, email }, { expiresIn: '1d' });
  }
}
