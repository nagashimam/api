import AddCouponSqlObjGenerator from "../sql/add-coupon-sql";
import UpdateRunner from "./run-update-controller";
import DatabaseGenerator from "./db/database-controller";
import {
  TransactionHandlerGenerator,
  TransactionStarter,
} from "./db/transaction-controller";
import { AddCouponParams } from "../../type-alias";
export function addCoupon(createdBy: string, title: string) {
  const generator = new AddCouponSqlObjGenerator();
  const sqlObj = generator.generateAddCouponSqlObject(
    createdBy,
    new Date(),
    title
  );
  const updateRunner = new UpdateRunner();
  updateRunner.runUpdate(
    new DatabaseGenerator(),
    sqlObj,
    new TransactionHandlerGenerator<AddCouponParams>(),
    new TransactionStarter()
  );
}
