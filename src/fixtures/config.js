const path = require('path');

module.exports = {
  dockerCompose: {
    projectName: 'community',
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml')
  },
  waitOn: [
    'tcp:27099'
  ],
  connections: {
    community: {
      connectionString: 'mongodb://localhost:27099/test'
    }
  }
};
