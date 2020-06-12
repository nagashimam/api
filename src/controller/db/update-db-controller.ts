import { Transaction, Database } from "@google-cloud/spanner";
import { SqlObj } from "../../../type-alias";

export async function updateDb<Params>(
  database: Database,
  sqlObject: SqlObj<Params>,
  err: Error,
  transaction: Transaction
) {
  if (err) throw err;

  try {
    await transaction.runUpdate(sqlObject);
    await transaction.commit();
  } catch (ex) {
    throw ex;
  } finally {
    database.close();
  }
}
