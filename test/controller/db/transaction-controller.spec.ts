import { Database, Transaction } from "@google-cloud/spanner";
import { TransactionStarter } from "../../../src/controller/db/transaction-controller";
import { TransactionHandlerGenerator } from "../../../src/controller/db/transaction-controller";

describe("書き込みトランザクションのテスト", () => {
  let database: Database;

  beforeEach(() => {
    database = jest.genMockFromModule("@google-cloud/spanner");
    database.runTransaction = jest.fn(() => {
      return null;
    });
  });

  const sqlObject = {
    sql: "masato",
    params: {
      uid: "aiueo",
      createdBy: "kakikukeko",
      title: "sashisuseso",
    },
  };

  test("トランザクションを開始すること", async () => {
    const databaseSpy = jest.spyOn(database, "runTransaction");
    const handler = async (err: Error, transaction: Transaction) => {};
    const starter = new TransactionStarter();

    starter.startTransaction(database, handler);
    expect(databaseSpy).toHaveBeenCalledTimes(1);
    expect(databaseSpy).toHaveBeenCalledWith(handler);
  });

  test("トランザクション処理を正しい引数で呼び出すこと", () => {
    const updateDbMock = jest.fn();
    const generator = new TransactionHandlerGenerator();
    const handler = generator.genTransactionHandler(
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
