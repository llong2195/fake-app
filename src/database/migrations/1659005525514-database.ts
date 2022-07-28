import { MigrationInterface, QueryRunner } from 'typeorm'

export class database1659005525514 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE upload_files (
      deleted tinyint NOT NULL DEFAULT 0,
      createdAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
      updatedAt datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      id int NOT NULL AUTO_INCREMENT,
      originUrl varchar(255) NOT NULL,
      thumbUrl varchar(255) NOT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
