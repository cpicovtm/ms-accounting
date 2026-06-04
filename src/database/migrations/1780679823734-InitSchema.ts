import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1780679823734 implements MigrationInterface {
    name = 'InitSchema1780679823734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL, "code" character varying(20) NOT NULL, "name" character varying(150) NOT NULL, "parent_id" uuid, "level" smallint NOT NULL, "account_type" character varying(20) NOT NULL, "nature" character varying(10) NOT NULL, "is_detail" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "description" character varying(500), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, CONSTRAINT "UQ_4a3f3a286a3d055274192578e82" UNIQUE ("code"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_account_is_active" ON "account" ("is_active") `);
        await queryRunner.query(`CREATE INDEX "idx_account_type" ON "account" ("account_type") `);
        await queryRunner.query(`CREATE INDEX "idx_account_code" ON "account" ("code") `);
        await queryRunner.query(`CREATE INDEX "idx_account_parent_id" ON "account" ("parent_id") `);
        await queryRunner.query(`CREATE TABLE "account_audit_log" ("id" uuid NOT NULL, "account_id" uuid NOT NULL, "action" character varying(20) NOT NULL, "field_changed" character varying(50), "old_value" text, "new_value" text, "changed_by" uuid, "changed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_727b72e88d2f173cedb10585e8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_audit_action" ON "account_audit_log" ("action") `);
        await queryRunner.query(`CREATE INDEX "idx_audit_account_id" ON "account_audit_log" ("account_id") `);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_619cd77ffcb55af7fec87349265" FOREIGN KEY ("parent_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_audit_log" ADD CONSTRAINT "FK_21d53e05247ab5e6abc772fb835" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_audit_log" DROP CONSTRAINT "FK_21d53e05247ab5e6abc772fb835"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_619cd77ffcb55af7fec87349265"`);
        await queryRunner.query(`DROP INDEX "public"."idx_audit_account_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_audit_action"`);
        await queryRunner.query(`DROP TABLE "account_audit_log"`);
        await queryRunner.query(`DROP INDEX "public"."idx_account_parent_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_account_code"`);
        await queryRunner.query(`DROP INDEX "public"."idx_account_type"`);
        await queryRunner.query(`DROP INDEX "public"."idx_account_is_active"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
