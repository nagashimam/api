import { Transaction, Database } from "@google-cloud/spanner";

export type SqlObj<Params> = {
  sql: string;
  params: Params;
};

export type AddCouponParams = {
  uid: string;
  createdBy: string;
  createdAt: string;
  title: string;
};

export type SqlExecutor<Params> = (
  database: Database,
  sqlObject: SqlObj<Params>,
  err: Error,
  transaction: Transaction
) => void;

export type TransactionHandler = (err: Error, transaction: Transaction) => void;

export type CouponObj = {
  uid: string;
  createdAt: string;
  createdBy: string;
  givenTo: string;
  title: string;
  usedAt: string;
};
