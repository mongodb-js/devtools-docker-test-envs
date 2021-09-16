import path from 'path';

import ConnectionString from 'mongodb-connection-string-url';

function buildConnectionString(
  username: string,
  password: string,
  authenticationDatabase: string,
  authenticationMechanism?: string
) {
  const uri = new ConnectionString('mongodb://localhost:28006/db1');

  uri.username = username;
  uri.password = password;
  uri.searchParams.set('authSource', authenticationDatabase);

  if (authenticationMechanism) {
    uri.searchParams.set('authMechanism', 'GSSAPI');
  }

  return uri.href;
}

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: ['tcp:28006'],
  connections: {
    scramReadWriteAnyDatabase: {
      connectionString: buildConnectionString('user1', 'password', 'admin'),
    },
    scramReadWriteAnyDatabaseScramSha1: {
      connectionString: buildConnectionString(
        'user1',
        'password',
        'admin',
        'SCRAM-SHA-1'
      ),
    },
    scramReadWriteAnyDatabaseScramSha256: {
      connectionString: buildConnectionString(
        'user1',
        'password',
        'admin',
        'SCRAM-SHA-256'
      ),
    },
    scramOnlyScramSha1: {
      connectionString: buildConnectionString(
        'scramSha1',
        'password',
        'admin',
        'SCRAM-SHA-1'
      ),
    },
    scramOnlyScramSha256: {
      connectionString: buildConnectionString(
        'scramSha256',
        'password',
        'admin',
        'SCRAM-SHA-256'
      ),
    },
    scramEncodedPassword: {
      connectionString: buildConnectionString(
        'randomPassword',
        encodeURIComponent('C;Ib86n5b8{AnExew[TU%XZy,)E6G!dk'),
        'admin'
      ),
    },
    scramPrivilegesOnNonExistingDatabases: {
      connectionString: buildConnectionString('user2', 'password', 'admin'),
    },
    scramPrivilegesOnNonExistingCollections: {
      connectionString: buildConnectionString(
        'customRole',
        'password',
        'admin'
      ),
    },
    scramAlternateAuthDb: {
      connectionString: buildConnectionString('authDb', 'password', 'authDb'),
    },
  },
};
