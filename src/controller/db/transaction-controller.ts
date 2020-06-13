import { Database } from "@google-cloud/spanner";
import { SqlObj, SqlExecutor, TransactionHandler } from "../../../type-alias";

export class TransactionStarter {
  public startTransaction(
    database: Database,
    handler: TransactionHandler
  ): void {
    database.runTransaction(handler);
  }
}

export class TransactionHandlerGenerator<Params> {
  public genTransactionHandler(
    sqlExecutor: SqlExecutor<Params>,
    database: Database,
    couponSqlObj: SqlObj<Params>
  ): TransactionHandler {
    return async (err, transaction) => {
      sqlExecutor(database, couponSqlObj, err, transaction);
    };
  }
}
