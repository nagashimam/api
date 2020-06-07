const dbUpdate = require("../../../src/controller/db/update-db-controller");

describe("Spannerの更新処理を行うこと", () => {
  const transaction = {
    runUpdate() {
      return;
    },
    commit() {
      return;
    },
  };

  const transactionWithError = {
    runUpdate() {
      throw new Error("エラー");
    },
    commit() {
      return;
    },
  };

  const sqlObject = {
    sql: `
          UPDATE
            Coupen Title
          SET
            Title = 'Dummy'
          WHERE
            1 = 2`,
  };

  const database = {
    close() {
      return;
    },
  };

  describe("実行前チェック", () => {
    test("エラーがなければコンソールに何も表示しないこと", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      await dbUpdate(console, null, transaction, sqlObject, database);
      await expect(consoleSpy).toHaveBeenCalledTimes(0);
      consoleSpy.mockReset();

      await dbUpdate(console, undefined, transaction, sqlObject, database);
      await expect(consoleSpy).toHaveBeenCalledTimes(0);
      consoleSpy.mockReset();

      await dbUpdate(console, "", transaction, sqlObject, database);
      await expect(consoleSpy).toHaveBeenCalledTimes(0);
      consoleSpy.mockReset();
    });

    test("エラーがあればコンソールに表示すること", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      await dbUpdate(console, "エラー", transaction, sqlObject, database);
      await expect(consoleSpy).toHaveBeenCalledTimes(1);
      await expect(consoleSpy).toHaveBeenCalledWith("エラー");
      consoleSpy.mockReset();
    });
  });

  describe("SQL実行", () => {
    test("エラーがなければSQLを実行すること", async () => {
      const transactionSpy = jest.spyOn(transaction, "runUpdate");
      await dbUpdate(console, undefined, transaction, sqlObject, database);
      await expect(transactionSpy).toHaveBeenCalledTimes(1);
      await expect(transactionSpy).toBeCalledWith(sqlObject);
      transactionSpy.mockReset();
    });

    test("SQL実行に成功したらコミットすること", async () => {
      const transactionSpy = jest.spyOn(transaction, "commit");
      await dbUpdate(console, undefined, transaction, sqlObject, database);
      await expect(transactionSpy).toHaveBeenCalledTimes(1);
      transactionSpy.mockReset();
    });

    test("SQL実行に失敗したらコンソールにエラーを表示すること", async () => {
      const consoleSpy = jest.spyOn(console, "error");
      await dbUpdate(
        console,
        undefined,
        transactionWithError,
        sqlObject,
        database
      );
      await expect(consoleSpy).toHaveBeenCalledTimes(1);
      await expect(consoleSpy).toHaveBeenCalledWith("エラー");
      consoleSpy.mockReset();
    });

    test("SQL実行に失敗したらコミットしないこと", async () => {
      const transactionSpy = jest.spyOn(transactionWithError, "commit");
      await dbUpdate(
        console,
        undefined,
        transactionWithError,
        sqlObject,
        database
      );
      await expect(transactionSpy).toHaveBeenCalledTimes(0);
      transactionSpy.mockReset();
    });
  });

  describe("実行後処理", () => {
    test("SQL実行に成功したらデータベースを切断する", async () => {
      const databaseSpy = jest.spyOn(database, "close");
      await dbUpdate(console, undefined, transaction, sqlObject, database);
      await expect(databaseSpy).toHaveBeenCalledTimes(1);
      databaseSpy.mockReset();
    });

    test("SQL実行に失敗してもデータベースを切断する", async () => {
      const databaseSpy = jest.spyOn(database, "close");
      await dbUpdate(
        console,
        undefined,
        transactionWithError,
        sqlObject,
        database
      );
      await expect(databaseSpy).toHaveBeenCalledTimes(1);
      databaseSpy.mockReset();
    });
  });
});
