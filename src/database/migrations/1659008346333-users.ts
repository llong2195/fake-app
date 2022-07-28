import { MigrationInterface, QueryRunner } from 'typeorm'

export class users1659008346333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE blog_like (
        deleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        blogId int NOT NULL,
        userId int NOT NULL,
        PRIMARY KEY (blogId,userId),
        KEY FK_8593bfadb48f1d071b7f870a3ae (userId),
        CONSTRAINT FK_829d592b8a4efff93ce9dd5a1c6 FOREIGN KEY (blogId) REFERENCES blogs (id) ON DELETE CASCADE,
        CONSTRAINT FK_8593bfadb48f1d071b7f870a3ae FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
