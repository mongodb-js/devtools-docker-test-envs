const path = require("path");

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, "docker-compose.yaml"),
  },
  waitOn: ["tcp:27020"],
  connections: {
    community: {
      connectionString: "mongodb://localhost:27020/test",
    },
  },
};
