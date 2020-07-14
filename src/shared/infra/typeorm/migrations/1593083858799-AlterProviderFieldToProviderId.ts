import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

/**
 * Migration:
 * [X] change appointments id type from varchar to uuid
 * [X] change users id type from varchar to uuid
 * [X] drop column provider from appointments
 * [X] add column provider_id on appointments
 * [X] relate provider_id <-> user_id on appointments
 * [X] undo all the operations above in reverse order
 */

export default class AlterProviderFieldToProviderId1593083858799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('appointments', 'id',
            new TableColumn({
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
            }),
        );

        await queryRunner.changeColumn('users', 'id',
            new TableColumn({
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
            }),
        );

        await queryRunner.dropColumn('appointments', 'provider');

        await queryRunner.addColumn('appointments',
            new TableColumn({
                name: 'provider_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        await queryRunner.createForeignKey('appointments',
            new TableForeignKey({
                name: 'AppointmentProvider',
                columnNames: ['provider_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn('appointments',
            new TableColumn(
                {
                    name: 'provider',
                    type: 'varchar',
                }),
        );

        await queryRunner.changeColumn('users', 'id',
            new TableColumn({
                name: 'id',
                type: 'varchar',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
            }),
        );

        await queryRunner.changeColumn('appointments', 'id',
            new TableColumn({
                name: 'id',
                type: 'varchar',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
            }),
        );
    }

}
