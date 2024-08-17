import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/entities/user.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticleQueryDto } from './dto/list-article-query.dto';
import { ArticleComment } from './entities/article-comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly article: Repository<Article>,
    @InjectRepository(ArticleComment)
    private readonly comments: Repository<ArticleComment>,
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

  async addComment(
    createCommentDto: CreateCommentDto,
    authorId: string,
    articleSlug: string,
  ) {
    const comment = this.comments.create(createCommentDto);
    comment.article = { slug: articleSlug } as Article;
    comment.author = { id: authorId } as User;

    const { id } = await this.comments.save(comment);

    return await this.comments
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'a')
      .where('c.id = :id', { id })
      .getOne();
  }

  async getArticleComments(articleSlug: string) {
    return await this.comments
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'a')
      .where('c.articleSlug = :articleSlug', { articleSlug })
      .getMany();
  }

  async deleteComment(id: string) {
    await this.comments.delete({ id });
  }

  // -| This adds an article to the list of a user's favorites and adds a user to the list of those that has favorited the article
  async favoriteArticle(articleSlug: string, userId: string) {
    const user = { id: userId } as User;
    await this.article
      .createQueryBuilder('c')
      .relation('favoritedBy')
      .of(articleSlug)
      .add(user);
  }

  async unfavoriteArticle(articleSlug: string, userId: string) {
    const user = { id: userId } as User;
    await this.article
      .createQueryBuilder('c')
      .relation('favoritedBy')
      .of(articleSlug)
      .remove(user);
  }
}
