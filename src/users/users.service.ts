import { Injectable } from '@nestjs/common';
import { CreateUserDto, ResponseDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async addNewUser(createUserDto: CreateUserDto) {
    let user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.username = createUserDto.email.split('@')[0];
    user = await this.users.save(user);
    return plainToInstance(ResponseDto, user);
  }

  findUserByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  findUserByID(id: string) {
    return `This action returns a #${id} user`;
  }
}
