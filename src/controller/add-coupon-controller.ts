import UpdateRunner from "./run-update-controller";
import DatabaseGenerator from "./db/database-controller";
import {
  TransactionHandlerGenerator,
  TransactionStarter,
} from "./db/transaction-controller";
import { AddCouponParams } from "../../type-alias";
import Coupon from "../model/coupon";
export async function addCoupon(
  createdBy: string,
  title: string
): Promise<Coupon> {
  const coupon = new Coupon(createdBy, title);
  const sqlObj = coupon.toAddSqlObject();
  const updateRunner = new UpdateRunner();
  await updateRunner.runUpdate(
    new DatabaseGenerator(),
    sqlObj,
    new TransactionHandlerGenerator<AddCouponParams>(),
    new TransactionStarter()
  );
  return coupon;
}
