import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { loginSchema, refreshSchema } from '@maincrm/shared';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('api/v1/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) body: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    const tokens = await this.authService.login(user);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/v1/auth/refresh'
    });
    return {
      accessToken: tokens.accessToken,
      user
    };
  }

  @Post('refresh')
  async refresh(@Body(new ZodValidationPipe(refreshSchema)) body: { refreshToken?: string }, @Res({ passthrough: true }) res: Response) {
    const token = body.refreshToken ?? res.req.cookies?.refresh_token;
    if (!token) {
      return { data: null, meta: null, error: { message: 'Refresh token required' } };
    }
    const tokens = await this.authService.refresh(token);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/api/v1/auth/refresh'
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const token = res.req.cookies?.refresh_token;
    await this.authService.logout(token);
    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
    return { success: true };
  }
}
