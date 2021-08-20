const path = require("path");

function buildConnectionString(
  auth: string,
  authenticationDatabase: string,
  authenticationMechanism?: string
) {
  const uri = `mongodb://${auth}@localhost:28006/db1?authSource=${authenticationDatabase}`;
  if (authenticationMechanism) {
    return `${uri}&${authenticationMechanism}`;
  }

  return uri;
}

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, "docker-compose.yaml"),
  },
  waitOn: ["tcp:28006"],
  connections: {
    readWriteAnyDatabase: {
      connectionString: buildConnectionString("user1:password", "admin"),
    },
    readWriteAnyDatabaseScramSha1: {
      connectionString: buildConnectionString(
        "user1:password",
        "admin",
        "SCRAM-SHA-1"
      ),
    },
    readWriteAnyDatabaseScramSha256: {
      connectionString: buildConnectionString(
        "user1:password",
        "admin",
        "SCRAM-SHA-256"
      ),
    },
    onlyScramSha1: {
      connectionString: buildConnectionString(
        "scramSha1:password",
        "admin",
        "SCRAM-SHA-1"
      ),
    },
    onlyScramSha256: {
      connectionString: buildConnectionString(
        "scramSha256:password",
        "admin",
        "SCRAM-SHA-256"
      ),
    },
    encodedPassword: {
      connectionString: buildConnectionString(
        "randomPassword:C;Ib86n5b8{AnExew[TU%XZy,)E6G!dk",
        "admin"
      ),
    },
    privilegesOnNonExistingDatabases: {
      connectionString: buildConnectionString("user2:password", "admin"),
    },
    privilegesOnNonExistingCollections: {
      connectionString: buildConnectionString("customRole:password", "admin"),
    },
    alternateAuthDb: {
      connectionString: buildConnectionString("authDb:password", "authDb"),
    },
  },
};
