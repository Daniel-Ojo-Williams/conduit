import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueConnections1723684693276 implements MigrationInterface {
  name = 'UniqueConnections1723684693276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_42819b4b272b654d1db736672d" ON "connections" ("followerId", "followingId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_42819b4b272b654d1db736672d"`,
    );
  }
}
