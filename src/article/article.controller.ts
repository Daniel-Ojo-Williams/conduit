import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthReq } from '../auth/types';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from '../guards/auth.guard';
import { ListArticleQueryDto } from './dto/list-article-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createArticle(
    @Req() req: AuthReq,
    @Body() createArticle: CreateArticleDto,
  ) {
    const { sub } = req.user;
    const article = await this.articleService.createArticle(sub, createArticle);

    return { article };
  }

  @Patch(':slug')
  async updateArticle(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(slug, updateArticleDto);
  }

  @Public()
  @Get()
  async listArticles(@Query() query?: ListArticleQueryDto) {
    return this.articleService.listArticles(query);
  }

  @Get('feed')
  async feedArticles(
    @Req() req: AuthReq,
    @Query() query?: ListArticleQueryDto,
  ) {
    const { sub } = req.user;
    return this.articleService.feedArticles(sub, query);
  }

  @Public()
  @Get(':slug')
  async getArticle(@Param('slug') slug: string) {
    return this.articleService.getArticle(slug);
  }

  @Post(':slug/comments')
  async addComment(
    @Req() req: AuthReq,
    @Param('slug') slug: string,
    @Body() addComment: CreateCommentDto,
  ) {
    const { sub } = req.user;
    return this.articleService.addComment(addComment, sub, slug);
  }

  @Get(':slug/comments')
  async getArticleComments(@Param('slug') slug: string) {
    return this.articleService.getArticleComments(slug);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':slug/comments/:id')
  async deleteArticleComment(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory() {
          return new BadRequestException('Id should be a valid UUID');
        },
      }),
    )
    id: string,
  ) {
    return this.articleService.deleteComment(id);
  }
}
