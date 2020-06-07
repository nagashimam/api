const writeTransaction = require("../../../src/controller/db/transaction-controller");
const sqlExecution = require("../../../src/controller/db/update-db-controller");
const sqlObject = {
  sql: `
        UPDATE
          Coupen Title
        SET
          Title = 'Dummy'
        WHERE
          1 = 2`,
};

describe("書き込みトランザクションのテスト", () => {
  const database = {
    close() {},
    runTransaction(func) {
      func();
    },
  };

  test("トランザクションを開始すること", async () => {
    const databaseSpy = jest.spyOn(database, "runTransaction");
    writeTransaction(database, sqlExecution, sqlObject);
    expect(databaseSpy).toHaveBeenCalledTimes(1);
  });

  test("SQLを実行すること", async () => {
    const sqlExecutionSpy = jest.fn(sqlExecution);
    writeTransaction(database, sqlExecutionSpy, sqlObject);
    expect(sqlExecutionSpy).toHaveBeenCalledTimes(1);
  });

  test("トランザクション後にデータベースを切断すること", async () => {
    const databaseSpy = jest.spyOn(database, "close");
    writeTransaction(database, sqlExecution, sqlObject);
    expect(databaseSpy).toHaveBeenCalledTimes(1);
  });
});
