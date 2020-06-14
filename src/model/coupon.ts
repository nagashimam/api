import * as crypto from "crypto";
import { CouponObj, AddCouponParams, SqlObj } from "../../type-alias";

export default class Coupon {
  private uid: string;
  private createdAt: Time;
  private createdBy: string;
  private givenTo: string;
  private title: string;
  private usedAt: Time;

  constructor(createdBy: string, title: string) {
    this.uid = this.generateUid(createdBy);
    this.createdBy = createdBy;
    this.title = title;
    this.createdAt = new Time();
  }

  private generateUid(createdBy: string): string {
    const rawUid = createdBy + new Date().getMilliseconds();
    return crypto.createHash("sha256").update(rawUid).digest("hex");
  }

  public toObject(): CouponObj {
    return {
      uid: this.uid,
      createdAt: this.createdAt.getTime(),
      createdBy: this.createdBy,
      givenTo: "",
      title: this.title,
      usedAt: "",
    };
  }

  public toAddSqlObject(): SqlObj<AddCouponParams> {
    const addCouponSQL = `
    INSERT Coupon (Uid,CreatedAt,CreatedBy,Title) 
    VALUES (@uid,@createdAt,@createdBy,@title)
    `;

    const addCouponParams = {
      uid: this.uid,
      createdAt: this.createdAt.getTime(),
      createdBy: this.createdBy,
      title: this.title,
    };

    return {
      sql: addCouponSQL,
      params: addCouponParams,
    };
  }
}

class Time {
  private time: string;

  constructor() {
    const date = new Date();
    const locale = "ja-JP-u-ca-japanese";
    const options = { era: "long" };
    this.time = date.toLocaleString(locale, options);
  }

  public getTime(): string {
    return this.time;
  }
}
