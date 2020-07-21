import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Create column avatar on users and undo it at down
 */

export default class AddAvatarFieldToUsers1593103178838
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}
