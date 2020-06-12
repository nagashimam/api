import { Database, Spanner } from "@google-cloud/spanner";

export default class DatabaseGenerator {
  public genDatabase(env: string): Database {
    const config = require("../../../config.json")[env];
    const projectId = config.projectId;
    const instanceId = config.instanceId;
    const databaseId = config.databaseId;

    const spanner = new Spanner({
      projectId: projectId,
    });

    return spanner.instance(instanceId).database(databaseId);
  }
}
