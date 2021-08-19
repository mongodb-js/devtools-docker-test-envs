const path = require('path');

const {default: ConnectionString} = require('mongodb-connection-string-url');

const connectionString = new ConnectionString('mongodb://localhost:30017');
connectionString.username = 'writer';
connectionString.password = 'Password1!';
connectionString.searchParams.set('authMechanism', 'PLAIN');

module.exports = {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml')
  },
  waitOn: [
    'tcp:30017'
  ],
  connections: {
    default: {
      connectionString: connectionString.href
    }
  }
};

