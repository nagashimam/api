import { Transaction, Database } from "@google-cloud/spanner";
import { CouponSqlObj } from "../../../type-alias";

export async function updateDb(
  database: Database,
  sqlObject: CouponSqlObj,
  logger: Console,
  err: Error,
  transaction: Transaction
) {
  if (err) return logger.error(err.message);

  try {
    await transaction.runUpdate(sqlObject);
    await transaction.commit();
  } catch (ex) {
    logger.error(ex.message);
  } finally {
    database.close();
  }
}
