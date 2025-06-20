import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1750445753999 implements MigrationInterface {
    name = 'Init1750445753999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "UQ_b0fc567cf51b1cf717a9e8046a1" UNIQUE ("email"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "skill" character varying(255) NOT NULL, "description" text NOT NULL, "location" "public"."job_post_location_enum" NOT NULL DEFAULT 'onsite', "salary" numeric, "company_id" uuid NOT NULL, "total_applications" integer NOT NULL DEFAULT '0', "max_applications" integer NOT NULL DEFAULT '100', "status" "public"."job_post_status_enum" NOT NULL DEFAULT 'active', "expired" boolean NOT NULL DEFAULT false, "expiredDate" TIMESTAMP NOT NULL DEFAULT now(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "PK_a70f902a85e6de57340d153c813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee26d130dc420c2e35f42573ce" ON "job_post" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_751dac40876c58809dc6ac6e6b" ON "job_post" ("skill") `);
        await queryRunner.query(`CREATE TYPE "public"."application_status_enum" AS ENUM('pending', 'interview', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "candidate_id" uuid NOT NULL, "job_post_id" uuid NOT NULL, "status" "public"."application_status_enum" NOT NULL DEFAULT 'pending', "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_06ff70d67f36b48b66686d0fb4" ON "application" ("status") `);
        await queryRunner.query(`CREATE TABLE "candidate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "skill" character varying NOT NULL, "resume" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "UQ_80e766f22573be71b86b2f05371" UNIQUE ("email"), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_864e5f71c640b2f7bda2900677" ON "candidate" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_80e766f22573be71b86b2f0537" ON "candidate" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_759c126824735c83959b8f6ba9" ON "candidate" ("phone") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e8aed70bdf0e31ab9763f4800" ON "candidate" ("skill") `);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "candidate_id" uuid NOT NULL, "application_id" uuid NOT NULL, "type" character varying NOT NULL, "read" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "application_id" uuid NOT NULL, "company_id" uuid NOT NULL, "candidate_id" uuid NOT NULL, "date" date NOT NULL, "time" TIME NOT NULL, "result" boolean NOT NULL DEFAULT false, "link" text, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_44c49a4feadefa5c6fa78bfb7d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_9d7fb58aa78330e7a8f2dacfeb7" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_683077d7193912bff4b23d5d08d" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_90e23a8574aab483525b07d4a81" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_de73cf6e996178eecdfa534a3a5" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_e8dacd97c73078e3bc7b7dc7211" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_de213ff1c7fdd2bf615f89fe048" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_8e01872c139fcee2dd16e5cb492" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_3aec56b0feb4008c1e63abd3c3b" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_3aec56b0feb4008c1e63abd3c3b"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_8e01872c139fcee2dd16e5cb492"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_de213ff1c7fdd2bf615f89fe048"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_e8dacd97c73078e3bc7b7dc7211"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_de73cf6e996178eecdfa534a3a5"`);
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_90e23a8574aab483525b07d4a81"`);
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_683077d7193912bff4b23d5d08d"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_9d7fb58aa78330e7a8f2dacfeb7"`);
        await queryRunner.query(`DROP TABLE "interview"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e8aed70bdf0e31ab9763f4800"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_759c126824735c83959b8f6ba9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80e766f22573be71b86b2f0537"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_864e5f71c640b2f7bda2900677"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06ff70d67f36b48b66686d0fb4"`);
        await queryRunner.query(`DROP TABLE "application"`);
        await queryRunner.query(`DROP TYPE "public"."application_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_751dac40876c58809dc6ac6e6b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee26d130dc420c2e35f42573ce"`);
        await queryRunner.query(`DROP TABLE "job_post"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
