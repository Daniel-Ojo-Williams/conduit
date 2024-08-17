import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, ResponseDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connections } from './entities/connections.entity';
import { DatabaseError } from 'pg-protocol';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Connections)
    private readonly conn: Repository<Connections>,
  ) {}

  async addNewUser(createUserDto: CreateUserDto) {
    let user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.username = createUserDto.username;
    user = await this.users.save(user);
    return plainToInstance(ResponseDto, user);
  }

  async findUserByEmail(email: string) {
    return await this.users
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .getOne();
  }

  async findUserByID(id: string) {
    const user = await this.users
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();

    return plainToInstance(ResponseDto, user);
  }

  async followUser(
    accountUSerId: string,
    accountUsername: string,
    followingUsername: string,
  ) {
    try {
      const user = await this.users.findOne({
        where: { username: followingUsername },
      });

      if (!user)
        throw new HttpException(
          { message: ['User not found'] },
          HttpStatus.NOT_FOUND,
        );

      await this.conn.save({ followerId: accountUSerId, followingId: user.id });

      return await this.getProfile(accountUSerId, followingUsername);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const dbError = <DatabaseError>error.driverError;
        switch (dbError.code) {
          case '23505':
            throw new ConflictException({
              message: 'You already follow this user',
            });
        }
      }
    }
  }

  async unfollowUser(username: string, currentUserId: string) {
    const user = await this.getProfile(currentUserId, username);

    if (!user) throw new BadRequestException('You do not follow this user');

    await this.conn.delete({
      followerId: currentUserId,
      followingId: user.profile.id,
    });

    return this.getProfile(currentUserId, username);
  }

  async getProfile(currentUserId: string, username: string) {
    const result = await this.users
      .createQueryBuilder('u')
      .addSelect(
        `EXISTS(SELECT 1 FROM connections AS c WHERE "followingId" = u.id AND "followerId" = :followerId)`,
        'follow',
      )
      .setParameter('followerId', currentUserId)
      .where('u.username = :username', { username })
      .getRawOne<User & { follow: boolean }>();

    if (!result)
      throw new HttpException(
        { message: ['User not found'] },
        HttpStatus.NOT_FOUND,
      );

    const user = Object.keys(result).reduce(
      (acc, key) => {
        const newKey = key.replace('u_', '');
        acc[newKey] = result[key];
        return acc;
      },
      {} as typeof result,
    );

    return {
      profile: {
        ...user,
      },
    };
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
