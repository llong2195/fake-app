import { MigrationInterface, QueryRunner } from 'typeorm'

export class report1660040999032 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE report (
        deleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        id int NOT NULL AUTO_INCREMENT,
        blogId int DEFAULT NULL,
        context varchar(255) DEFAULT NULL,
        userId int DEFAULT NULL,
        PRIMARY KEY (id),
        KEY FK_9348e8235f47e399f3cd7e14a25 (blogId),
        KEY FK_e347c56b008c2057c9887e230aa (userId),
        CONSTRAINT FK_9348e8235f47e399f3cd7e14a25 FOREIGN KEY (blogId) REFERENCES blogs (id) ON DELETE SET NULL,
        CONSTRAINT FK_e347c56b008c2057c9887e230aa FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL
      ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
