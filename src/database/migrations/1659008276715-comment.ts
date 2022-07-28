import { MigrationInterface, QueryRunner } from 'typeorm'

export class comment1659008276715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE blogs (
        deleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        id int NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        mediaId int DEFAULT NULL,
        userId int DEFAULT NULL,
        status enum('CREATED','APPROVE','CANCEL') NOT NULL DEFAULT 'CREATED',
        numSeen int DEFAULT 0,
        numLike int DEFAULT 0,
        numComment int DEFAULT 0,
        content longtext NOT NULL,
        description text NOT NULL,
        PRIMARY KEY (id),
        KEY FK_50205032574e0b039d655f6cfd3 (userId),
        KEY FK_b8d6eeabe2f01f7af105654a6e5 (mediaId),
        CONSTRAINT FK_50205032574e0b039d655f6cfd3 FOREIGN KEY (userId) REFERENCES users (id) ON DELETE RESTRICT,
        CONSTRAINT FK_b8d6eeabe2f01f7af105654a6e5 FOREIGN KEY (mediaId) REFERENCES upload_files (id) ON DELETE RESTRICT
      ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
