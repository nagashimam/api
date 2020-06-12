import { Transaction, Database } from "@google-cloud/spanner";

export type SqlObj<Params> = {
  sql: string;
  params: Params;
};

export type AddCouponParams = { uid: string; createdBy: string; title: string };

export type SqlExecutor<Params> = (
  database: Database,
  sqlObject: SqlObj<Params>,
  console: Console,
  err: Error,
  transaction: Transaction
) => void;

export type TransactionHandler = (err: Error, transaction: Transaction) => void;
