import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthReq } from '../auth/types';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from '../guards/auth.guard';

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
  @Get(':slug')
  async getArticle(@Param('slug') slug: string) {
    return this.articleService.getArticle(slug);
  }
}
