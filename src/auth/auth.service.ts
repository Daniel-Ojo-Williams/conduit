import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { ResponseDto } from 'src/users/dto/create-user.dto';
import { UserPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly Users: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    return await this.Users.addNewUser(createAuthDto);
  }

  async login(createAuthDto: Omit<CreateAuthDto, 'username'>) {
    const user = await this.Users.findUserByEmail(createAuthDto.email);

    if (!user)
      throw new UnauthorizedException({
        message: 'Invalid credentials passed',
      });

    const passwordMatch = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!passwordMatch)
      throw new UnauthorizedException({
        message: 'Invalid credentials passed',
      });

    // jwt token
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const token = await this.jwt.signAsync(payload);
    const userObj = plainToInstance(ResponseDto, user);

    return {
      user: {
        ...userObj,
        token,
      },
    };
  }
}
