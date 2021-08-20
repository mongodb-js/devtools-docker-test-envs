const path = require("path");

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, "docker-compose.yaml"),
  },
  waitOn: ["tcp:27021"],
  connections: {
    enterprise: {
      connectionString: "mongodb://localhost:27021/test",
    },
  },
};
