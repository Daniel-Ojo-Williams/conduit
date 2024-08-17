import { MigrationInterface, QueryRunner } from 'typeorm';

export class FavoriteArticle1723858284480 implements MigrationInterface {
  name = 'FavoriteArticle1723858284480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "favorite_article" ("articleSlug" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b4771e6ce8137477012dadf584e" PRIMARY KEY ("articleSlug", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f6d12f70d18073c1fb50dbe3f7" ON "favorite_article" ("articleSlug") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7bd4ad5c173e6a497bb908cde" ON "favorite_article" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_article" ADD CONSTRAINT "FK_f6d12f70d18073c1fb50dbe3f7d" FOREIGN KEY ("articleSlug") REFERENCES "article"("slug") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_article" ADD CONSTRAINT "FK_e7bd4ad5c173e6a497bb908cdea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorite_article" DROP CONSTRAINT "FK_e7bd4ad5c173e6a497bb908cdea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_article" DROP CONSTRAINT "FK_f6d12f70d18073c1fb50dbe3f7d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e7bd4ad5c173e6a497bb908cde"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6d12f70d18073c1fb50dbe3f7"`,
    );
    await queryRunner.query(`DROP TABLE "favorite_article"`);
  }
}
