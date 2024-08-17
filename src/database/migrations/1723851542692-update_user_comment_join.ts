import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserCommentJoin1723851542692 implements MigrationInterface {
  name = 'UpdateUserCommentJoin1723851542692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_d8f3f866704414d775378e2f717"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "REL_d8f3f866704414d775378e2f71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_d8f3f866704414d775378e2f717" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_comment" DROP CONSTRAINT "FK_d8f3f866704414d775378e2f717"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "REL_d8f3f866704414d775378e2f71" UNIQUE ("authorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_comment" ADD CONSTRAINT "FK_d8f3f866704414d775378e2f717" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
