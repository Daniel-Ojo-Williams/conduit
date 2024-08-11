import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from 'src/auth/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private config: ConfigService,
    private ref: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.ref.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
    ]);

    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const token = this.extractToken(req);

    if (!token) throw new UnauthorizedException({ message: 'Unauthorized' });

    try {
      const payload = await this.jwt.verifyAsync<UserPayload>(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      req['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    return true;
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);
