const path = require('path');

module.exports = {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml')
  },
  waitOn: [
    'tcp:28006'
  ],
  connections: {
    password: {
      connectionString: 'mongodb://mongo:27017',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        password: 'password'
      }
    },
    identityKey: {
      connectionString: 'mongodb://mongo:27017',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        identityKeyFile: path.resolve(__dirname, 'keys', 'key-without-passphrase'),
      }
    },
    identityKeyWithPassphrase: {
      connectionString: 'mongodb://mongo:27017',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        identityKeyFile: path.resolve(__dirname, 'keys', 'key-with-passphrase'),
        identityKeyPassphrase: 'passphrase'
      }
    }
  }
};
