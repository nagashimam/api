import { Database, Spanner } from "@google-cloud/spanner";
function instantiateDatabase(env: string): Database {
  const config = require("../../../config.json")[env];
  const projectId = config.projectId;
  const instanceId = config.instanceId;
  const databaseId = config.databaseId;

  const spanner = new Spanner({
    projectId: projectId,
  });

  return spanner.instance(instanceId).database(databaseId);
}

module.exports = instantiateDatabase;
