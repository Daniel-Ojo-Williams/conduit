import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';
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
    try {
      return await this.Users.addNewUser(createAuthDto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const dbError = <DatabaseError>error.driverError;
        console.log(dbError.code);
        switch (dbError.code) {
          case '23505':
            throw new ConflictException({
              message: `Email <${createAuthDto.email}> already exists`,
            });
        }
      }
    }
  }

  async login(createAuthDto: CreateAuthDto) {
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
    const payload: UserPayload = { sub: user.id, email: user.email };
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
