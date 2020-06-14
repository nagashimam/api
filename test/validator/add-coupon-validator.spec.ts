import AddCouponValidator from "../../src/validator/add-coupon-validator";

describe("Coupon追加リクエストのバリデーション", () => {
  const validator = new AddCouponValidator();
  test("createdByがリクエストにない場合、エラーを返すこと", () => {
    expect(validator.validateAddCouponRequest(null, "title")).toBe(
      "createdByは必須項目です"
    );
    expect(validator.validateAddCouponRequest(undefined, "title")).toBe(
      "createdByは必須項目です"
    );
    expect(validator.validateAddCouponRequest("", "title")).toBe(
      "createdByは必須項目です"
    );
  });

  test("createdByが65文字以上の場合、エラーを返すこと", () => {
    expect(
      validator.validateAddCouponRequest(
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよ12らりるれろわおん90123456789012345",
        "title"
      )
    ).toBe("createdByは64文字以下で入力してください");

    expect(
      validator.validateAddCouponRequest(
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよ12らりるれろわおん9012345678901234",
        "title"
      )
    ).toBe("");
  });

  test("titleがリクエストにない場合、エラーを返すこと", () => {
    expect(validator.validateAddCouponRequest("createdBy", null)).toBe(
      "titleは必須項目です"
    );
    expect(validator.validateAddCouponRequest("createdBy", undefined)).toBe(
      "titleは必須項目です"
    );
    expect(validator.validateAddCouponRequest("createdBy", "")).toBe(
      "titleは必須項目です"
    );
  });

  test("titleが65文字以上の場合、エラーを返すこと", () => {
    expect(
      validator.validateAddCouponRequest(
        "createdBy",
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよ12らりるれろわおん90123456789012345"
      )
    ).toBe("titleは64文字以下で入力してください");

    expect(
      validator.validateAddCouponRequest(
        "createdBy",
        "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよ12らりるれろわおん9012345678901234"
      )
    ).toBe("");
  });
});
