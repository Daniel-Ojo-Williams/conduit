import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/entities/user.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticleQueryDto } from './dto/list-article-query.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly article: Repository<Article>,
  ) {}

  async createArticle(authorId: string, createArticleDto: CreateArticleDto) {
    const article = this.article.create(createArticleDto);

    article.author = { id: authorId } as User;
    const { slug } = await this.article.save(article);
    return this.getArticle(slug);
  }

  async getArticle(slug: string) {
    return await this.article
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.author', 'author.id')
      .where('a.slug = :slug', { slug })
      .getOne();
  }

  async listArticles(query?: ListArticleQueryDto) {
    const offset = query?.offset || 0;
    const limit = query?.limit || 20;
    const author = query?.author;
    const tag = query?.tag;

    const listQuery = this.article
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.author', 'author')
      .orderBy('a.createdAt', 'DESC')
      .limit(limit)
      .skip(offset);

    if (author)
      listQuery.where('author.username = :username', { username: author });

    if (tag) listQuery.andWhere(':tag = ANY(a.tagList)', { tag });

    return await listQuery.getMany();
  }

  async updateArticle(slug: string, updateArticleDto: UpdateArticleDto) {
    await this.article
      .createQueryBuilder()
      .update()
      .set(updateArticleDto)
      .where('slug = :slug', { slug })
      .execute();

    return await this.getArticle(slug);
  }

  async feedArticles(accountUserId: string, query: ListArticleQueryDto) {
    const limit = query?.limit || 10;
    const offset = query?.offset || 0;

    const articles = await this.article
      .createQueryBuilder('a')
      .leftJoin('connections', 'c', 'c.followingId = a.authorId')
      .where('c.followerId = :userId', { userId: accountUserId })
      .skip(offset)
      .limit(limit)
      .getMany();

    return articles;
  }
}
