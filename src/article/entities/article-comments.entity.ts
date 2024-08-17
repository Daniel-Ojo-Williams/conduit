import { Article } from './article.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ArticleComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'now',
  })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn({ name: 'articleSlug' })
  article: Article;
}
