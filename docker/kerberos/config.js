const path = require('path');
const execa = require('execa');

const {default: ConnectionString} = require('mongodb-connection-string-url');

const principal = 'mongodb.user';
const defaultConnectionString = new ConnectionString('mongodb://mongodb-kerberos-1.example.com:29017');
defaultConnectionString.username = principal;
defaultConnectionString.searchParams.set('authMechanism', 'GSSAPI');

const alternateConnectionString = new ConnectionString('mongodb://mongodb-kerberos-2.example.com:29018');
alternateConnectionString.username = principal;
alternateConnectionString.searchParams.set('authMechanism', 'GSSAPI');
alternateConnectionString.searchParams.set('authMechanismProperties', 'SERVICE_NAME:alternate');

const crossRealmConnectionString = new ConnectionString('mongodb://mongodb-kerberos-3.examplecrossrealm.com:29019');
crossRealmConnectionString.username = principal;
crossRealmConnectionString.searchParams.set('authMechanism', 'GSSAPI');

module.exports = {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml')
  },
  waitOn: [
    'tcp:29017',
    'tcp:29018',
    'tcp:29019'
  ],
  hosts: [
    'mongodb-kerberos-1.example.com',
    'mongodb-kerberos-2.example.com',
    'mongodb-kerberos-3.examplecrossrealm.com'
  ],
  setup: async() => {
    try { // hemdal
      await execa('kinit',
        ['--password-file=STDIN', principal], {input: 'password'});
    } catch (e) { // mit
      await execa(
        'kinit', [principal], {input: 'password'});
    }
  },
  teardown: async() => {
    try {
      await execa('kdestroy', ['-p', principal]);
    } catch (e) {
      //
    }
  },
  connections: {
    default: {
      connectionString: defaultConnectionString.href
    },
    alternate: {
      connectionString: alternateConnectionString.href
    },
    crossRealm: {
      connectionString: crossRealmConnectionString.href
    }
  }
};
