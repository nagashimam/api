import { Database } from "@google-cloud/spanner";
import {
  CouponSqlObj,
  SqlExecutor,
  TransactionHandler,
} from "../../../type-alias";

export function startTransaction(
  database: Database,
  handler: TransactionHandler
): void {
  database.runTransaction(handler);
}

export function prepareTransation(
  sqlExecutor: SqlExecutor,
  database: Database,
  couponSqlObj: CouponSqlObj,
  console: Console
): TransactionHandler {
  return async (err, transaction) => {
    sqlExecutor(database, couponSqlObj, console, err, transaction);
  };
}
