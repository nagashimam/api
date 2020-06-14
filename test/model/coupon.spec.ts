import Coupon from "../../src/model/coupon";
import * as crypto from "crypto";

describe("objectへ正しく変換出来ること", () => {
  const createdBy = "masato";
  const title = "肩叩き30分無料";

  const milliseconds = 1000;
  const getMillisecondsMock = jest
    .spyOn(Date.prototype, "getMilliseconds")
    .mockReturnValue(milliseconds);

  const localeString = "令和2年6月15日 1:20:30";
  const toLocaleStringSpy = jest
    .spyOn(Date.prototype, "toLocaleString")
    .mockReturnValue(localeString);

  beforeEach(() => {
    getMillisecondsMock.mockClear();
    toLocaleStringSpy.mockClear();
  });

  test("uidが(createdBy)+(インスタンス化された時のUnixタイムスタンプ)のハッシュであること", () => {
    const expectedUid = crypto
      .createHash("sha256")
      .update(`${createdBy}${milliseconds}`)
      .digest("hex");

    const coupon = new Coupon(createdBy, title);
    const couponObj = coupon.toObject();
    expect(couponObj.uid).toBe(expectedUid);
  });

  test("createdAtがインスタンス化した時刻の和暦であること", () => {
    const coupon = new Coupon(createdBy, title);
    const couponObj = coupon.toObject();

    const expectedOptions = { era: "long" };
    const expectedLocale = "ja-JP-u-ca-japanese";
    expect(couponObj.createdAt).toBe(localeString);
    expect(toLocaleStringSpy).toBeCalledTimes(1);
    expect(toLocaleStringSpy).toBeCalledWith(expectedLocale, expectedOptions);
  });

  test("createdByとtitleがコンストラクタで渡した値であること", () => {
    const coupon = new Coupon(createdBy, title);
    const couponObj = coupon.toObject();
    expect(couponObj.createdBy).toBe(createdBy);
    expect(couponObj.title).toBe(title);
  });
});

describe("sqlオブジェクトへ正しく変換出来ること", () => {
  const createdBy = "masato";
  const title = "肩叩き30分無料";

  const milliseconds = 1000;
  const getMillisecondsMock = jest
    .spyOn(Date.prototype, "getMilliseconds")
    .mockReturnValue(milliseconds);

  const localeString = "令和2年6月15日 1:20:30";
  const toLocaleStringSpy = jest
    .spyOn(Date.prototype, "toLocaleString")
    .mockReturnValue(localeString);

  beforeEach(() => {
    getMillisecondsMock.mockClear();
    toLocaleStringSpy.mockClear();
  });

  test("sqlオブジェクトのsqlが正しいinsert文であること", () => {
    const removeSpaces = (str: string) => {
      const spaceCharacters = new RegExp(/\s/, "g");
      return str.replace(spaceCharacters, "");
    };

    const expectedSQL = `
    INSERT Coupon (Uid,CreatedAt,CreatedBy,Title) 
    VALUES (@uid,@createdAt,@createdBy,@title)
    `;

    const coupon = new Coupon(createdBy, title);
    const couponAddSql = coupon.toAddSqlObject().sql;
    expect(removeSpaces(couponAddSql)).toBe(removeSpaces(expectedSQL));
  });

  test("sqlオブジェクトのuidが(createdBy)+(インスタンス化された時のUnixタイムスタンプ)のハッシュであること", () => {
    const expectedUid = crypto
      .createHash("sha256")
      .update(`${createdBy}${milliseconds}`)
      .digest("hex");

    const coupon = new Coupon(createdBy, title);
    const couponAddSqlObj = coupon.toAddSqlObject();
    expect(couponAddSqlObj.params.uid).toBe(expectedUid);
  });

  test("sqlオブジェクトのcreatedAtがインスタンス化した時刻の和暦であること", () => {
    const coupon = new Coupon(createdBy, title);
    const couponAddSqlObj = coupon.toAddSqlObject();

    const expectedOptions = { era: "long" };
    const expectedLocale = "ja-JP-u-ca-japanese";
    expect(couponAddSqlObj.params.createdAt).toBe(localeString);
    expect(toLocaleStringSpy).toBeCalledTimes(1);
    expect(toLocaleStringSpy).toBeCalledWith(expectedLocale, expectedOptions);
  });

  test("sqlオブジェクトのcreatedByとtitleがコンストラクタで渡した値であること", () => {
    const coupon = new Coupon(createdBy, title);
    const couponAddSqlObj = coupon.toAddSqlObject();
    expect(couponAddSqlObj.params.createdBy).toBe(createdBy);
    expect(couponAddSqlObj.params.title).toBe(title);
  });
});
