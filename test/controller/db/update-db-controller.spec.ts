import { updateDb } from "../../../src/controller/db/update-db-controller";
import { Transaction, Database } from "@google-cloud/spanner";
import { generateAddCouponSqlObject } from "../../../src/sql/add-coupon-sql";
import { ExecuteSqlRequest } from "@google-cloud/spanner/build/src/transaction";

describe("Spannerの更新処理を行うこと", () => {
  let transaction: Transaction;
  let database: Database;

  beforeEach(() => {
    transaction = jest.genMockFromModule("@google-cloud/spanner");
    transaction.runUpdate = jest.fn((query: string | ExecuteSqlRequest) => {
      return null;
    });
    transaction.commit = jest.fn(() => {
      return null;
    });

    database = jest.genMockFromModule("@google-cloud/spanner");
    database.close = jest.fn(() => {
      return null;
    });
  });

  const sqlObject = generateAddCouponSqlObject(
    "masato",
    new Date(),
    "肩たたき30分"
  );

  describe("実行前チェック", () => {
    test("エラーがなければコンソールに何も表示しないこと", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      await updateDb(database, sqlObject, console, null, transaction);
      await expect(consoleSpy).toHaveBeenCalledTimes(0);
      consoleSpy.mockClear();

      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(consoleSpy).toHaveBeenCalledTimes(0);
      consoleSpy.mockClear();
    });

    test("エラーがあればコンソールに表示すること", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      await updateDb(
        database,
        sqlObject,
        console,
        new Error("エラー"),
        transaction
      );
      await expect(consoleSpy).toHaveBeenCalledTimes(1);
      await expect(consoleSpy).toHaveBeenCalledWith("エラー");
      consoleSpy.mockClear();
    });
  });

  describe("SQL実行", () => {
    test("エラーがなければSQLを実行すること", async () => {
      const transactionSpy = jest.spyOn(transaction, "runUpdate");
      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(transactionSpy).toHaveBeenCalledTimes(1);
      await expect(transactionSpy).toBeCalledWith(sqlObject);
      transactionSpy.mockClear();
    });

    test("SQL実行に成功したらコミットすること", async () => {
      const transactionSpy = jest.spyOn(transaction, "commit");
      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(transactionSpy).toHaveBeenCalledTimes(1);
      transactionSpy.mockClear();
    });

    test("SQL実行に失敗したらコンソールにエラーを表示すること", async () => {
      transaction.runUpdate = jest.fn((query: string | ExecuteSqlRequest) => {
        throw new Error("エラー");
      });
      const consoleSpy = jest.spyOn(console, "error");
      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(consoleSpy).toHaveBeenCalledTimes(1);
      await expect(consoleSpy).toHaveBeenCalledWith("エラー");
      consoleSpy.mockClear();
    });

    test("SQL実行に失敗したらコミットしないこと", async () => {
      transaction.runUpdate = jest.fn((query: string | ExecuteSqlRequest) => {
        throw new Error("エラー");
      });
      const transactionSpy = jest.spyOn(transaction, "commit");
      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(transactionSpy).toHaveBeenCalledTimes(0);
      transactionSpy.mockClear();
    });
  });

  describe("実行後処理", () => {
    test("SQL実行に成功したらデータベースを切断する", async () => {
      const databaseSpy = jest.spyOn(database, "close");
      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(databaseSpy).toHaveBeenCalledTimes(1);
      databaseSpy.mockClear();
    });

    test("SQL実行に失敗してもデータベースを切断する", async () => {
      const databaseSpy = jest.spyOn(database, "close");
      await updateDb(database, sqlObject, console, undefined, transaction);
      await expect(databaseSpy).toHaveBeenCalledTimes(1);
      databaseSpy.mockClear();
    });
  });
});
