import * as httpMocks from "node-mocks-http";

import AddCouponController from "../../src/controller/add-coupon-controller";
import addCouponRouter from "../../src/router/add-coupon-router";
import AddCouponValidator from "../../src/validator/add-coupon-validator";
import Coupon from "../../src/model/coupon";

describe("Coupon追加処理のルーティング", () => {
  const validateAddCouponRequestSpy = jest.spyOn(
    AddCouponValidator.prototype,
    "validateAddCouponRequest"
  );
  const addCouponSpy = jest.spyOn(AddCouponController.prototype, "addCoupon");

  const request = httpMocks.createRequest({
    method: "POST",
    url: "/coupons",
    body: {
      createdBy: "masato",
      title: "洗濯1回",
    },
  });

  beforeEach(() => {
    validateAddCouponRequestSpy.mockClear();
    addCouponSpy.mockClear();
  });

  test("バリデーションエラーがある場合、400(Bad Request)を返す", async () => {
    validateAddCouponRequestSpy.mockReturnValue("バリデーションエラー");
    const response = httpMocks.createResponse();

    await addCouponRouter(request, response);
    expect(response.statusCode).toBe(400);
    expect(response._getData()).toBe("バリデーションエラー");
  });

  test("バリデーションエラーがないかつDB更新に成功した場合、追加したCouponをJSON形式で返す", async () => {
    validateAddCouponRequestSpy.mockReturnValue("");
    const coupon = new Coupon("masato", "洗濯1回");
    addCouponSpy.mockReturnValue(Promise.resolve(coupon));

    const response = httpMocks.createResponse();

    await addCouponRouter(request, response);
    expect(response.statusCode).toBe(201);
    expect(response._getJSONData()).toStrictEqual(coupon.toObject());
  });

  test("バリデーションエラーがないかつDB更新に失敗した場合、503(Service Unavailable)", async () => {
    validateAddCouponRequestSpy.mockReturnValue("");
    const coupon = new Coupon("masato", "洗濯1回");
    addCouponSpy.mockImplementation(() => {
      throw new Error("DB更新に失敗");
    });

    const response = httpMocks.createResponse();

    await addCouponRouter(request, response);
    expect(response.statusCode).toBe(503);
    expect(response._getData()).toBe("しばらく経ってからやり直してください");
  });
});
