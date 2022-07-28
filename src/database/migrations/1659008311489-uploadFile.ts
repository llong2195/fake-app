import { MigrationInterface, QueryRunner } from 'typeorm'

export class uploadFile1659008311489 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE comment (
        deleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        id int NOT NULL AUTO_INCREMENT,
        context varchar(255) NOT NULL,
        userId int NOT NULL,
        blogId int NOT NULL,
        PRIMARY KEY (id),
        KEY FK_c0354a9a009d3bb45a08655ce3b (userId),
        KEY FK_5dec255234c5b7418f3d1e88ce4 (blogId),
        CONSTRAINT FK_5dec255234c5b7418f3d1e88ce4 FOREIGN KEY (blogId) REFERENCES blogs (id) ON DELETE RESTRICT,
        CONSTRAINT FK_c0354a9a009d3bb45a08655ce3b FOREIGN KEY (userId) REFERENCES users (id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
