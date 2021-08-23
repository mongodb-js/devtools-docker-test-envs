const path = require("path");

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, "docker-compose.yaml"),
  },
  waitOn: ["tcp:28006"],
  connections: {
    sshPassword: {
      connectionString: "mongodb://mongo:27017",
      sshTunnel: {
        host: "localhost",
        port: 22222,
        username: "root",
        password: "password",
      },
    },
    sshIdentityKey: {
      connectionString: "mongodb://mongo:27017",
      sshTunnel: {
        host: "localhost",
        port: 22222,
        username: "root",
        identityKeyFile: path.resolve(
          __dirname,
          "keys",
          "key-without-passphrase"
        ),
      },
    },
    sshIdentityKeyWithPassphrase: {
      connectionString: "mongodb://mongo:27017",
      sshTunnel: {
        host: "localhost",
        port: 22222,
        username: "root",
        identityKeyFile: path.resolve(__dirname, "keys", "key-with-passphrase"),
        identityKeyPassphrase: "passphrase",
      },
    },
  },
};
