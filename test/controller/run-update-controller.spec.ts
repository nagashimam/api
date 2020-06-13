import UpdateRunner from "../../src/controller/run-update-controller";
import DatabaseGenerator from "../../src/controller/db/database-controller";
import { AddCouponParams, SqlObj } from "../../type-alias";
import { TransactionHandlerGenerator } from "../../src/controller/db/transaction-controller";
import { TransactionStarter } from "../../src/controller/db/transaction-controller";
import { Database, Transaction } from "@google-cloud/spanner";
import { updateDb } from "../../src/controller/db/update-db-controller";

describe("DB更新処理を実行すること", () => {
  test("DB更新処理を実行すること", () => {
    const dbGenerator: DatabaseGenerator = jest.genMockFromModule(
      "../../src/controller/db/database-controller"
    );
    const database: Database = jest.genMockFromModule("@google-cloud/spanner");
    dbGenerator.genDatabase = jest.fn(() => {
      return database;
    });

    const sqlObj: SqlObj<AddCouponParams> = {
      sql: "",
      params: { uid: "", createdBy: "", title: "" },
    };

    const handlerGenerator: TransactionHandlerGenerator<AddCouponParams> = jest.genMockFromModule(
      "../../src/controller/db/transaction-controller"
    );
    const handler = async (err: Error, transaction: Transaction) => {};
    handlerGenerator.genTransactionHandler = jest.fn(() => {
      return handler;
    });

    const starter: TransactionStarter = jest.genMockFromModule(
      "../../src/controller/db/transaction-controller"
    );
    starter.startTransaction = jest.fn();

    new UpdateRunner().runUpdate(
      dbGenerator,
      sqlObj,
      handlerGenerator,
      starter
    );

    expect(dbGenerator.genDatabase).toHaveBeenCalledTimes(1);
    expect(dbGenerator.genDatabase).toHaveBeenCalledWith(process.env.NODE_ENV);

    expect(handlerGenerator.genTransactionHandler).toHaveBeenCalledTimes(1);
    expect(handlerGenerator.genTransactionHandler).toHaveBeenCalledWith(
      updateDb,
      database,
      sqlObj
    );

    expect(starter.startTransaction).toHaveBeenCalledTimes(1);
    expect(starter.startTransaction).toHaveBeenCalledWith(database, handler);
  });
});
