import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleComments1723797616701 implements MigrationInterface {
  name = 'ArticleComments1723797616701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "article_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "authorId" uuid, "articleSlug" character varying, CONSTRAINT "REL_d8f3f866704414d775378e2f71" UNIQUE ("authorId"), CONSTRAINT "PK_35f34db03db8f2c304a3bd1216d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_d8f3f866704414d775378e2f717" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_cc7080923dfe6162f7c8dd131e2" FOREIGN KEY ("articleSlug") REFERENCES "article"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_cc7080923dfe6162f7c8dd131e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_d8f3f866704414d775378e2f717"`,
    );
    await queryRunner.query(`DROP TABLE "article_comment"`);
  }
}
