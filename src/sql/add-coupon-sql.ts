import { AddCouponSqlObj } from "../../type-alias";
const hash = require("crypto");

const addCouponSQL = `
INSERT Coupon (Uid,CreatedAt,CreatedBy,Title) 
VALUES (@uid,CURRENT_TIMESTAMP(),@createdBy,@title)
`;

function addCouponSQLParams(userName: string, date: Date, title: string) {
  return {
    uid: generateUid(userName, date),
    createdBy: userName,
    title: title,
  };
}

function generateUid(userName: string, date: Date): string {
  const rawUid = userName + date.getMilliseconds();
  return hash.createHash("sha256").update(rawUid).digest("hex");
}

export function generateAddCouponSqlObject(
  createdBy: string,
  date: Date,
  title: string
): AddCouponSqlObj {
  return {
    sql: addCouponSQL,
    params: addCouponSQLParams(createdBy, date, title),
  };
}
