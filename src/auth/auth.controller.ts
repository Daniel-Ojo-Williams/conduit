import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from '../guards/auth.guard';
import { LoginDto } from './dto/login.dto';
import { HandleDbError } from 'src/filters/dbError.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseFilters(new HandleDbError('register'))
  @Post('register')
  async register(@Body() createAuthDto: { user: CreateAuthDto }) {
    const user = await this.authService.register(createAuthDto.user);

    return { user };
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }
}
