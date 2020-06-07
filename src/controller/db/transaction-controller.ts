import { Database } from "@google-cloud/spanner";
function transaction(
  database: Database,
  sqlExecution: Function,
  sqlObject: { sql: string }
): void {
  database.runTransaction(async (err, transaction) => {
    sqlExecution(console, err, transaction, sqlObject, database);
  });
}

module.exports = transaction;
