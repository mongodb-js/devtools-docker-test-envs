const TestEnvironment = require('./src/test-environment');

module.exports = () => ({
  community: new TestEnvironment(require('./docker/community/config.js')),
  enterprise:  new TestEnvironment(require('./docker/enterprise/config.js')),
  kerberos: new TestEnvironment(require('./docker/kerberos/config.js')),
  ldap: new TestEnvironment(require('./docker/ldap/config.js')),
  replicaSet: new TestEnvironment(require('./docker/replica/config.js-set')),
  scram: new TestEnvironment(require('./docker/scram/config.js')),
  sharded: new TestEnvironment(require('./docker/sharded/config.js')),
  ssh: new TestEnvironment(require('./docker/ssh/config.js')),
  tls: new TestEnvironment(require('./docker/tls/config.js'))
});
