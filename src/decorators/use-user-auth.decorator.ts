import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export function UseUserAuthDecorator() {
  return applyDecorators(
    UseGuards(AuthGuard('auth')),
    ApiBearerAuth('Bearer')
  );
}