import UpdateRunner from "../../src/controller/run-update-controller";
import Coupon from "../../src/model/coupon";
import AddCouponValidator from "../../src/validator/add-coupon-validator";
import AddCouponController from "../../src/controller/add-coupon-controller";

jest.mock("../../src/model/coupon");
jest.mock("../../src/controller/run-update-controller");

const CouponMock = Coupon as jest.Mock;
const UpdateRunnerMock = UpdateRunner as jest.Mock;

describe("Coupon追加処理", () => {
  const controller = new AddCouponController();

  const toAddObjectMock = jest.fn();
  CouponMock.mockImplementation(() => {
    return {
      toAddSqlObject() {
        toAddObjectMock();
      },
    };
  });

  const runUpdateMock = jest.fn();
  UpdateRunnerMock.mockImplementation(() => {
    return {
      runUpdate() {
        runUpdateMock();
      },
    };
  });

  beforeEach(() => {
    CouponMock.mockClear();
    UpdateRunnerMock.mockClear();
  });

  test("CouponのtoAddSqlObjとUpdateRunnerのrunUpdateを呼び出すこと", async () => {
    controller.addCoupon("masato", "肩叩き10分無料");
    await expect(toAddObjectMock).toBeCalledTimes(1);
    await expect(runUpdateMock).toBeCalledTimes(1);
  });

  test("データベース更新処理に成功した場合Couponモデルを返すこと", async () => {
    const result = await controller.addCoupon("masato", "肩叩き10分無料");
    expect(CouponMock).toBeCalledTimes(1);
    expect(CouponMock).toBeCalledWith("masato", "肩叩き10分無料");
    expect(result).toBeTruthy();
  });

  test("データベース更新処理に失敗した場合、例外を投げると", async () => {
    UpdateRunnerMock.mockImplementation(() => {
      return {
        runUpdate() {
          throw new Error();
        },
      };
    });
    const result = controller.addCoupon("masato", "肩たたき30分無料");
    await expect(result).rejects.toThrow();
  });
});
