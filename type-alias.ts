import { Transaction, Database } from "@google-cloud/spanner";

export type AddCouponSqlObj = {
  sql: string;
  params: { uid: string; createdBy: string; title: string };
};

// まだ更新系は作っていないので適当
export type UpdateCouponSqlObj = {
  sql: string;
  params: { uid: string; createdBy: string; title: string };
};

export type CouponSqlObj = AddCouponSqlObj | UpdateCouponSqlObj;

export type SqlExecutor = (
  database: Database,
  sqlObject: CouponSqlObj,
  console: Console,
  err: Error,
  transaction: Transaction
) => void;

export type TransactionHandler = (err: Error, transaction: Transaction) => void;
