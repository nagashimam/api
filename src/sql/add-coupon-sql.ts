import { SqlObj, AddCouponParams } from "../../type-alias";
import { createHash } from "crypto";
export default class AddCouponSqlObjGenerator {
  private addCouponSQL = `
  INSERT Coupon (Uid,CreatedAt,CreatedBy,Title) 
  VALUES (@uid,CURRENT_TIMESTAMP(),@createdBy,@title)
  `;

  private addCouponSQLParams(
    userName: string,
    date: Date,
    title: string
  ): AddCouponParams {
    return {
      uid: this.generateUid(userName, date),
      createdBy: userName,
      title: title,
    };
  }

  private generateUid(userName: string, date: Date): string {
    const rawUid = userName + date.getMilliseconds();
    return createHash("sha256").update(rawUid).digest("hex");
  }

  public generateAddCouponSqlObject(
    createdBy: string,
    date: Date,
    title: string
  ): SqlObj<AddCouponParams> {
    return {
      sql: this.addCouponSQL,
      params: this.addCouponSQLParams(createdBy, date, title),
    };
  }
}
