import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitializeSchema1570735798681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const productTable: Table = new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar(200)',
          },
        ],
      });
      await queryRunner.createTable(productTable);

      const reviewTable: Table = new Table({
        name: 'review',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'productId',
            type: 'varchar(36)',
            isNullable: false,
          },
          {
            name: 'trueToSize',
            type: 'integer',
            isNullable: false,
          },
        ],
        foreignKeys: [{
          name: 'review_productId_FK',
          columnNames: ['productId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'product',
          onDelete: 'CASCADE',
        }],
      });
      await queryRunner.createTable(reviewTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE "review"`);
      await queryRunner.query(`DROP TABLE "product"`);
    }
}
