import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740590441065 implements MigrationInterface {
    name = '1740590439Migration1740590441065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "products" jsonb NOT NULL, "total_price" numeric NOT NULL, "lat" character varying NOT NULL, "long" character varying NOT NULL, "user_id" integer NOT NULL, "restaurant" integer NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
