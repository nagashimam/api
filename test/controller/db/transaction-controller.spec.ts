import { Database, Transaction } from "@google-cloud/spanner";
import { generateAddCouponSqlObject } from "../../../src/sql/add-coupon-sql";
import {
  startTransaction,
  prepareTransation,
} from "../../../src/controller/db/transaction-controller";
import { updateDb } from "../../../src/controller/db/update-db-controller";

describe("書き込みトランザクションのテスト", () => {
  let database: Database;

  beforeEach(() => {
    database = jest.genMockFromModule("@google-cloud/spanner");
    database.runTransaction = jest.fn(() => {
      return null;
    });
  });

  const sqlObject = generateAddCouponSqlObject(
    "masato",
    new Date(),
    "肩たたき30分"
  );

  test("トランザクションを開始すること", async () => {
    const databaseSpy = jest.spyOn(database, "runTransaction");
    const handler = async (err, transaction) => {
      updateDb(database, sqlObject, console, err, transaction);
    };
    startTransaction(database, handler);
    expect(databaseSpy).toHaveBeenCalledTimes(1);
    expect(databaseSpy).toBeCalledWith(handler);
  });

  test("トランザクション処理を正しい引数で呼び出すこと", () => {
    const updateDbMock = jest.fn(updateDb);
    const handler = prepareTransation(
      updateDbMock,
      database,
      sqlObject,
      console
    );
    const err = new Error("エラー");
    const transaction: Transaction = jest.genMockFromModule(
      "@google-cloud/spanner"
    );
    handler(err, transaction);
    expect(updateDbMock).toHaveBeenCalledTimes(1);
    expect(updateDbMock).toHaveBeenCalledWith(
      database,
      sqlObject,
      console,
      err,
      transaction
    );
  });
});
