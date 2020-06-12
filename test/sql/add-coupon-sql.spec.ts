import { SqlObj, AddCouponParams } from "../../type-alias";
import {} from "../../src/sql/add-coupon-sql";
import AddCouponSqlObjGenerator from "../../src/sql/add-coupon-sql";

describe("クーポンを追加するSQLを生成すること", () => {
  const hash = require("crypto");

  test("SQLのパラメーターを正しく設定すること", () => {
    const date = new Date();
    jest.spyOn(date, "getMilliseconds").mockImplementation(() => 10000);

    const sqlObjGenerator = new AddCouponSqlObjGenerator();
    const sqlObj: SqlObj<AddCouponParams> = sqlObjGenerator.generateAddCouponSqlObject(
      "masato",
      date,
      "30分肩たたき無料"
    );

    expect(sqlObj.params.createdBy).toBe("masato");
    expect(sqlObj.params.title).toBe("30分肩たたき無料");

    const expectedUid = hash
      .createHash("sha256")
      .update("masato10000")
      .digest("hex");

    expect(sqlObj.params.uid).toBe(expectedUid);
  });
});
