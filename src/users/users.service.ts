import { Injectable } from '@nestjs/common';
import { CreateUserDto, ResponseDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

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
    user.username = createUserDto.username;
    user = await this.users.save(user);
    return plainToInstance(ResponseDto, user);
  }

  findUserByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  async findUserByID(id: string) {
    const user = await this.users
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();

    return plainToInstance(ResponseDto, user);
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    await this.users
      .createQueryBuilder('u')
      .update(updateUser)
      .where('id = :id', { id })
      .execute();

    return await this.findUserByID(id);
  }
}
