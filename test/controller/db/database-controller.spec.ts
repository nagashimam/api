import { Database } from "@google-cloud/spanner";

const database = require("../../../src/controller/db/database-controller");

describe("環境毎のデータベースインスタンスを生成すること", () => {
  test("開発環境用のデータベースインスタンスを生成すること", () => {
    const db: Database = database("development");
    const id = db.id;
    expect(id).toBe("coupon-db");
  });
});
