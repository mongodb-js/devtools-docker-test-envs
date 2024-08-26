import path from 'path';

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: ['tcp:22222'],
  connections: {
    sshPassword: {
      connectionString: 'mongodb://mongo:27017',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        password: 'password',
      },
    },
    sshIdentityKey: {
      connectionString: 'mongodb://mongo:27017',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        identityKeyFile: path.resolve(
          __dirname,
          'keys',
          'key-without-passphrase'
        ),
      },
    },
    sshIdentityKeyWithPassphrase: {
      connectionString: 'mongodb://mongo:27017',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        identityKeyFile: path.resolve(__dirname, 'keys', 'key-with-passphrase'),
        identityKeyPassphrase: 'passphrase',
      },
    },
    sshReplicaSetSeedlist: {
      connectionString:
        'mongodb://mongodb-rs-ssh-1:28001,mongodb-rs-ssh-2:28002,mongodb-rs-ssh-3:28003/',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        password: 'password',
      },
    },
    sshReplicaSetByReplSetName: {
      connectionString:
        'mongodb://mongodb-rs-ssh-1:28001/?replicaSet=replicaset',
      sshTunnel: {
        host: 'localhost',
        port: 22222,
        username: 'root',
        password: 'password',
      },
    },
  },
};
