import { User } from '../../users/entities/user.entity';
import * as _crypto from 'node:crypto';
import { ArticleComment } from './article-comments.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryColumn()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', default: '{}', array: true })
  tagList: Array<string>;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('boolean', { default: false })
  favorited: false;

  @Column('int', { default: 0 })
  favoritesCount: number;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn()
  author: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'favorite_article',
    joinColumn: {
      name: 'articleSlug',
      referencedColumnName: 'slug',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  favoritedBy: User[];

  @OneToMany(() => ArticleComment, (comment) => comment)
  comments: ArticleComment[];

  @BeforeInsert()
  createSlug() {
    const append = _crypto.randomBytes(8).toString('hex').slice(0, 12);

    const title = this.title;
    let slug = title[0].toLowerCase() + title.slice(1);
    slug = slug.split(' ').join('-');
    this.slug = `${slug}-${append}`;
  }
}
