import { User } from './user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['followerId', 'followingId'], { unique: true })
export class Connections {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'followerId' })
  followerId: string;

  @Column({ name: 'followingId' })
  followingId: string;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followingId' })
  following: User;
}
