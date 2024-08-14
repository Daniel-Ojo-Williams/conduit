import { Body, Controller, Post, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthReq } from 'src/auth/types';

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
}
