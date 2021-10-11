import path from 'path';
import execa from 'execa';

import ConnectionString from 'mongodb-connection-string-url';

const principal = 'mongodb.user@EXAMPLE.COM';
const simple = new ConnectionString(
  'mongodb://mongodb-kerberos-1.example.com:29017'
);
simple.username = principal;
simple.searchParams.set('authMechanism', 'GSSAPI');

const alternate = new ConnectionString(
  'mongodb://mongodb-kerberos-2.example.com:29018'
);
alternate.username = principal;
alternate.searchParams.set('authMechanism', 'GSSAPI');
alternate.searchParams.set('authMechanismProperties', 'SERVICE_NAME:alternate');

const crossRealm = new ConnectionString(
  'mongodb://mongodb-kerberos-3.examplecrossrealm.com:29019'
);
crossRealm.username = principal;
crossRealm.searchParams.set('authMechanism', 'GSSAPI');

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: ['tcp:29017', 'tcp:29018', 'tcp:29019'],
  hosts: [
    'mongodb-kerberos-1.example.com',
    'mongodb-kerberos-2.example.com',
    'mongodb-kerberos-3.examplecrossrealm.com',
  ],
  setup: async (): Promise<void> => {
    try {
      // hemdal
      await execa('kinit', ['--password-file=STDIN', principal], {
        input: 'password',
      });
    } catch (e) {
      // mit
      await execa('kinit', [principal], { input: 'password' });
    }
  },
  teardown: async (): Promise<void> => {
    try {
      await execa('kdestroy', ['-p', principal]);
    } catch (e) {
      //
    }
  },
  connections: {
    kerberos: {
      connectionString: simple.href,
    },
    kerberosAlternate: {
      connectionString: alternate.href,
    },
    kerberosCrossRealm: {
      connectionString: crossRealm.href,
    },
  },
};
