module.exports = class Data1669722016115 {
    name = 'Data1669722016115'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "fee" numeric NOT NULL, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d6624eacc30144ea97915fe846" ON "transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_070c555a86b0b41a534a55a659" ON "transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_76bdfed1a7eb27c6d8ecbb7349" ON "transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_0751309c66e97eac9ef1149362" ON "transfer" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_f4007436c1b546ede08a4fd7ab" ON "transfer" ("amount") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "erc1155_owner" ("id" character varying NOT NULL, "balance" numeric, CONSTRAINT "PK_1edcc74b7820dd0d897b9d92171" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "erc1155_transfer" ("id" character varying NOT NULL, "timestamp" numeric NOT NULL, "block" integer NOT NULL, "transaction_hash" text NOT NULL, "token_id" character varying, "from_id" character varying, "to_id" character varying, CONSTRAINT "PK_0674a25d29eb0aa7f281b272203" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_73c0abeaec03ddf4d11b840721" ON "erc1155_transfer" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_0d2e8f94d7d57de35fbefa0c1c" ON "erc1155_transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_889c304916fe3fec132ecec073" ON "erc1155_transfer" ("to_id") `)
        await db.query(`CREATE TABLE "erc1155_contract" ("id" character varying NOT NULL, CONSTRAINT "PK_714a9ea4826d73898b5c2251116" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "erc1155_token" ("id" character varying NOT NULL, "uri" text, "owner_id" character varying, "contract_id" character varying, CONSTRAINT "PK_63124737654b07d068bf54cfcfe" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f8b449f74ab74862ce3d754a0c" ON "erc1155_token" ("owner_id") `)
        await db.query(`CREATE INDEX "IDX_2b7ca9f92b256b0bf702d11e50" ON "erc1155_token" ("contract_id") `)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_0751309c66e97eac9ef11493623" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "erc1155_transfer" ADD CONSTRAINT "FK_73c0abeaec03ddf4d11b840721a" FOREIGN KEY ("token_id") REFERENCES "erc1155_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "erc1155_transfer" ADD CONSTRAINT "FK_0d2e8f94d7d57de35fbefa0c1c7" FOREIGN KEY ("from_id") REFERENCES "erc1155_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "erc1155_transfer" ADD CONSTRAINT "FK_889c304916fe3fec132ecec0731" FOREIGN KEY ("to_id") REFERENCES "erc1155_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "erc1155_token" ADD CONSTRAINT "FK_f8b449f74ab74862ce3d754a0c9" FOREIGN KEY ("owner_id") REFERENCES "erc1155_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "erc1155_token" ADD CONSTRAINT "FK_2b7ca9f92b256b0bf702d11e50a" FOREIGN KEY ("contract_id") REFERENCES "erc1155_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_d6624eacc30144ea97915fe846"`)
        await db.query(`DROP INDEX "public"."IDX_70ff8b624c3118ac3a4862d22c"`)
        await db.query(`DROP INDEX "public"."IDX_070c555a86b0b41a534a55a659"`)
        await db.query(`DROP INDEX "public"."IDX_76bdfed1a7eb27c6d8ecbb7349"`)
        await db.query(`DROP INDEX "public"."IDX_0751309c66e97eac9ef1149362"`)
        await db.query(`DROP INDEX "public"."IDX_f4007436c1b546ede08a4fd7ab"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "erc1155_owner"`)
        await db.query(`DROP TABLE "erc1155_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_73c0abeaec03ddf4d11b840721"`)
        await db.query(`DROP INDEX "public"."IDX_0d2e8f94d7d57de35fbefa0c1c"`)
        await db.query(`DROP INDEX "public"."IDX_889c304916fe3fec132ecec073"`)
        await db.query(`DROP TABLE "erc1155_contract"`)
        await db.query(`DROP TABLE "erc1155_token"`)
        await db.query(`DROP INDEX "public"."IDX_f8b449f74ab74862ce3d754a0c"`)
        await db.query(`DROP INDEX "public"."IDX_2b7ca9f92b256b0bf702d11e50"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_76bdfed1a7eb27c6d8ecbb73496"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_0751309c66e97eac9ef11493623"`)
        await db.query(`ALTER TABLE "erc1155_transfer" DROP CONSTRAINT "FK_73c0abeaec03ddf4d11b840721a"`)
        await db.query(`ALTER TABLE "erc1155_transfer" DROP CONSTRAINT "FK_0d2e8f94d7d57de35fbefa0c1c7"`)
        await db.query(`ALTER TABLE "erc1155_transfer" DROP CONSTRAINT "FK_889c304916fe3fec132ecec0731"`)
        await db.query(`ALTER TABLE "erc1155_token" DROP CONSTRAINT "FK_f8b449f74ab74862ce3d754a0c9"`)
        await db.query(`ALTER TABLE "erc1155_token" DROP CONSTRAINT "FK_2b7ca9f92b256b0bf702d11e50a"`)
    }
}