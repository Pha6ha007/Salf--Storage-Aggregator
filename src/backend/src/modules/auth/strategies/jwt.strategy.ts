import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('jwt.secret');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not set. Cannot start application without a secure secret.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['auth_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        deletedAt: true,
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
