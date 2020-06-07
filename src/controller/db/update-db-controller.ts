import { Transaction, Database } from "@google-cloud/spanner";
async function updateDb(
  logger: Console,
  err: any,
  transaction: Transaction,
  sqlObject: { sql: string },
  database: Database
) {
  if (err) return logger.error(err);

  try {
    await transaction.runUpdate(sqlObject);
    await transaction.commit();
  } catch (ex) {
    logger.error(ex.message);
  } finally {
    database.close();
  }
}

module.exports = updateDb;
