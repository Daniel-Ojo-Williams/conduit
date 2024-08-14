import { User } from '../../users/entities/user.entity';
import * as _crypto from 'node:crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @BeforeInsert()
  createSlug() {
    const append = _crypto.randomBytes(8).toString('hex').slice(0, 12);

    const title = this.title;
    let slug = title[0].toLowerCase() + title.slice(1);
    slug = slug.split(' ').join('-');
    this.slug = `${slug}-${append}`;
  }
}
