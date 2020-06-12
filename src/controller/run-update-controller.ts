import DatabaseGenerator from "./db/database-controller";
import {
  TransactionStarter,
  TransactionHandlerGenerator,
} from "./db/transaction-controller";
import { updateDb } from "./db/update-db-controller";
import { SqlObj } from "../../type-alias";

export default class UpdateRunner {
  public runUpdate<Params>(
    dbGenerator: DatabaseGenerator,
    sqlObj: SqlObj<Params>,
    handlerGenerator: TransactionHandlerGenerator<Params>,
    starter: TransactionStarter
  ) {
    const database = dbGenerator.genDatabase(process.env.NODE_ENV);
    const handler = handlerGenerator.genTransactionHandler(
      updateDb,
      database,
      sqlObj,
      console
    );
    starter.startTransaction(database, handler);
  }
}
