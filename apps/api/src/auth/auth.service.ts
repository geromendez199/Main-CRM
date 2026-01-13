import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { PrismaService } from '../common/prisma.service.js';
import type { AuthUser, JwtPayload } from './auth.types.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role.name,
      teamId: user.teamId
    };
  }

  async login(user: AuthUser): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.rotateRefreshToken(user, uuidv4(), null);
    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(user: AuthUser, familyId: string, existingTokenId: string | null): Promise<string> {
    const tokenId = uuidv4();
    const payload: JwtPayload & { tokenId: string; familyId: string } = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      tokenId,
      familyId
    };
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d'
    });

    const tokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + this.parseExpiry(process.env.JWT_REFRESH_EXPIRES_IN ?? '30d'));

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        familyId,
        tokenHash,
        expiresAt
      }
    });

    if (existingTokenId) {
      await this.prisma.refreshToken.update({
        where: { id: existingTokenId },
        data: { revokedAt: new Date() }
      });
    }

    return refreshToken;
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload & { tokenId: string; familyId: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const record = await this.prisma.refreshToken.findUnique({ where: { id: payload.tokenId } });
    if (!record || record.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { familyId: payload.familyId, revokedAt: null },
        data: { revokedAt: new Date() }
      });
      throw new UnauthorizedException('Refresh token revoked');
    }

    const valid = await argon2.verify(record.tokenHash, refreshToken);
    if (!valid) {
      await this.prisma.refreshToken.updateMany({
        where: { familyId: payload.familyId, revokedAt: null },
        data: { revokedAt: new Date() }
      });
      throw new UnauthorizedException('Refresh token invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true }
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const authUser: AuthUser = {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role.name,
      teamId: user.teamId
    };

    const accessToken = await this.signAccessToken(authUser);
    const newRefreshToken = await this.rotateRefreshToken(authUser, payload.familyId, payload.tokenId);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async signAccessToken(user: AuthUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
      teamId: user.teamId
    };
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '900s'
    });
  }

  async logout(refreshToken?: string | null): Promise<void> {
    if (!refreshToken) {
      return;
    }
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      await this.prisma.refreshToken.update({
        where: { id: payload.tokenId },
        data: { revokedAt: new Date() }
      });
    } catch {
      return;
    }
  }

  private parseExpiry(value: string): number {
    if (value.endsWith('d')) {
      return Number(value.replace('d', '')) * 24 * 60 * 60 * 1000;
    }
    if (value.endsWith('h')) {
      return Number(value.replace('h', '')) * 60 * 60 * 1000;
    }
    if (value.endsWith('m')) {
      return Number(value.replace('m', '')) * 60 * 1000;
    }
    if (value.endsWith('s')) {
      return Number(value.replace('s', '')) * 1000;
    }
    return Number(value) * 1000;
  }
}
