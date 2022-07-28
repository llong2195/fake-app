import { MigrationInterface, QueryRunner } from 'typeorm'

export class blogs1659008198874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE users (
        deleted tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        id int NOT NULL AUTO_INCREMENT,
        email varchar(255) NOT NULL,
        firstName varchar(255) NOT NULL,
        lastName varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        role enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
        isActive tinyint NOT NULL DEFAULT 1,
        walletAddress varchar(255) DEFAULT NULL,
        avatarId int DEFAULT NULL,
        OTP varchar(6) DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY IDX_97672ac88f789774dd47f7c8be (email),
        KEY FK_3e1f52ec904aed992472f2be147 (avatarId),
        CONSTRAINT FK_3e1f52ec904aed992472f2be147 FOREIGN KEY (avatarId) REFERENCES upload_files (id) ON DELETE SET NULL
      ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
