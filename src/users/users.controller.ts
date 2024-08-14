import { Controller, Get, Body, Patch, Req, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { NoEmptyBoyPipe, UpdateUserDto } from './dto/update-user.dto';
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
  @UsePipes(new NoEmptyBoyPipe())
  async updateUser(@Req() req: AuthReq, @Body() updateUser: UpdateUserDto) {
    const { sub } = req.user;
    const user = await this.usersService.updateUser(sub, updateUser);

    return { message: 'User updated successfully', data: user };
  }
}
