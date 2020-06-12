import { updateDb } from "../../../src/controller/db/update-db-controller";
import { Transaction, Database } from "@google-cloud/spanner";
import { SqlObj, AddCouponParams } from "../../../type-alias";

describe("Spannerの更新処理を行うこと", () => {
  let transaction: Transaction;
  let database: Database;

  beforeEach(() => {
    transaction = jest.genMockFromModule("@google-cloud/spanner");
    transaction.runUpdate = jest.fn((query: string) => {
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

  const sqlObj: SqlObj<AddCouponParams> = {
    sql: "",
    params: { uid: "", createdBy: "", title: "" },
  };

  describe("実行前チェック", () => {
    test("エラーがあればそのまま投げること", async () => {
      const err = new Error("エラー");
      const result = updateDb(database, sqlObj, err, transaction);
      await expect(result).rejects.toThrow();
    });
  });

  describe("SQL実行", () => {
    test("エラーがなければSQLを実行すること", async () => {
      const transactionSpy = jest.spyOn(transaction, "runUpdate");
      await updateDb(database, sqlObj, undefined, transaction);
      await expect(transactionSpy).toHaveBeenCalledTimes(1);
      await expect(transactionSpy).toBeCalledWith(sqlObj);
      transactionSpy.mockClear();
    });

    test("SQL実行に成功したらコミットすること", async () => {
      const transactionSpy = jest.spyOn(transaction, "commit");
      await updateDb(database, sqlObj, undefined, transaction);
      await expect(transactionSpy).toHaveBeenCalledTimes(1);
      transactionSpy.mockClear();
    });

    test("SQL実行に失敗したら例外を投げること", async () => {
      const err = new Error("エラー");
      transaction.runUpdate = jest.fn((query: string) => {
        throw err;
      });
      const result = updateDb(database, sqlObj, undefined, transaction);
      await expect(result).rejects.toThrow(err);
    });

    test("SQL実行に失敗したらコミットしないこと", async () => {
      transaction.runUpdate = jest.fn((query: string) => {
        throw new Error("エラー");
      });
      const transactionSpy = jest.spyOn(transaction, "commit");
      updateDb(database, sqlObj, undefined, transaction);
      await expect(transactionSpy).toHaveBeenCalledTimes(0);
      transactionSpy.mockClear();
    });
  });

  describe("実行後処理", () => {
    test("SQL実行に成功したらデータベースを切断する", async () => {
      const databaseSpy = jest.spyOn(database, "close");
      await updateDb(database, sqlObj, undefined, transaction);
      await expect(databaseSpy).toHaveBeenCalledTimes(1);
      databaseSpy.mockClear();
    });

    test("SQL実行に失敗してもデータベースを切断する", async () => {
      const databaseSpy = jest.spyOn(database, "close");
      await updateDb(database, sqlObj, undefined, transaction);
      await expect(databaseSpy).toHaveBeenCalledTimes(1);
      databaseSpy.mockClear();
    });
  });
});
