import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  HttpCode,
  HttpStatus,
  Post,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthReq } from 'src/auth/types';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getCurrentUser(@Req() req: AuthReq) {
    const { sub } = req.user;
    const user = await this.usersService.findUserByID(sub);
    return user;
  }

  @Patch()
  async updateUser(@Req() req: AuthReq, @Body() updateUser: UpdateUserDto) {
    const { sub } = req.user;
    const user = await this.usersService.updateUser(sub, updateUser);

    return { message: 'User updated successfully', data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post(':username/follow')
  async followUser(@Req() req: AuthReq, @Param('username') username: string) {
    const { sub, username: accountUsername } = req.user;
    return this.usersService.followUser(sub, accountUsername, username);
  }
}
