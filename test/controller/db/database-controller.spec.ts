import DatabaseGenerator from "../../../src/controller/db/database-controller";

describe("環境毎のデータベースインスタンスを生成すること", () => {
  test("開発環境用のデータベースインスタンスを生成すること", () => {
    const db = new DatabaseGenerator().genDatabase(process.env.NODE_ENV);
    expect(db.id).toBe("coupon-db");
  });
});
