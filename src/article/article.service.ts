import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/entities/user.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

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

  async updateArticle(slug: string, updateArticleDto: UpdateArticleDto) {
    await this.article
      .createQueryBuilder()
      .update()
      .set(updateArticleDto)
      .where('slug = :slug', { slug })
      .execute();

    return await this.getArticle(slug);
  }
}
