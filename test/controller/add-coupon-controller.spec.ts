import { addCoupon } from "../../src/controller/add-coupon-controller";
import UpdateRunner from "../../src/controller/run-update-controller";
import DatabaseGenerator from "../../src/controller/db/database-controller";
import { AddCouponParams, SqlObj } from "../../type-alias";
import {
  TransactionStarter,
  TransactionHandlerGenerator,
} from "../../src/controller/db/transaction-controller";
import AddCouponSqlObjGenerator from "../../src/sql/add-coupon-sql";

jest.mock("../../src/sql/add-coupon-sql");
jest.mock("../../src/controller/run-update-controller");

const AddCouponSqlObjGeneratorMock = AddCouponSqlObjGenerator as jest.Mock;
const UpdateRunnerMock = UpdateRunner as jest.Mock;

describe("Coupon追加処理", () => {
  const addSqlObj: SqlObj<AddCouponParams> = {
    sql: "test sql",
    params: {
      uid: "unique id",
      createdBy: "masato",
      title: "肩たたき30分無料",
    },
  };

  beforeEach(() => {
    AddCouponSqlObjGeneratorMock.mockClear();
    UpdateRunnerMock.mockClear();
  });

  test("SQL生成処理を正しい引数で呼び出すこと", () => {
    const generateAddCouponSqlObjectMock = jest.fn(
      (createdBy: string, date: Date, title: string) => addSqlObj
    );
    AddCouponSqlObjGeneratorMock.mockImplementation(() => {
      return {
        generateAddCouponSqlObject(
          createdBy: string,
          date: Date,
          title: string
        ) {
          return generateAddCouponSqlObjectMock(createdBy, date, title);
        },
      };
    });
    addCoupon("masato", "肩たたき30分無料");

    expect(generateAddCouponSqlObjectMock).toHaveBeenCalledTimes(1);

    // 1回目の呼び出しのオブジェクト
    const call = generateAddCouponSqlObjectMock.mock.calls[0];

    // インデックスがそれぞれ引数の位置に対応する
    expect(call[0]).toBe("masato");
    expect(call[1]).toBeInstanceOf(Date);
    expect(call[2]).toBe("肩たたき30分無料");
  });

  test("データベース更新処理を正しいSQLオブジェクトで呼び出すこと", () => {
    const runUpdateMock = jest.fn();
    UpdateRunnerMock.mockImplementation(() => {
      return {
        runUpdate(
          dbGenerator: DatabaseGenerator,
          sqlObj: SqlObj<AddCouponParams>,
          handlerGenerator: TransactionHandlerGenerator<AddCouponParams>,
          starter: TransactionStarter
        ) {
          runUpdateMock(sqlObj);
        },
      };
    });
    addCoupon("masato", "肩たたき30分無料");
    expect(runUpdateMock).toHaveBeenCalledTimes(1);
    expect(runUpdateMock).toHaveBeenCalledWith(addSqlObj);
  });
});
