const { default: createTestEnvironments } = require('./../src');
const { v4 } = require('uuid');
const path = require('path');
const fs = require('fs/promises');

const FILE_PATH = path.resolve(process.cwd(), 'compass-connections.json');
const connectionsWithVariants = {
  enterprise: ['enterprise'],
  ldap: ['ldap'],
  scram: [
    'scramReadWriteAnyDatabase',
    'scramReadWriteAnyDatabaseScramSha1',
    'scramReadWriteAnyDatabaseScramSha256',
    'scramOnlyScramSha1',
    'scramOnlyScramSha256',
    'scramEncodedPassword',
    'scramPrivilegesOnNonExistingDatabases',
    'scramPrivilegesOnNonExistingCollections',
    'scramAlternateAuthDb',
  ],
  sharded: ['sharded'],
  ssh: [
    'sshPassword',
    'sshIdentityKey',
    'sshIdentityKeyWithPassphrase',
    'sshReplicaSetSeedlist',
    'sshReplicaSetByReplSetName',
  ],
  tls: [
    'tlsUnvalidated',
    'tlsServerValidation',
    'tlsServerValidationSsh',
    'tlsServerAndClientValidation',
    'tlsServerAndClientValidationKeyCrt',
    'tlsX509',
    'tlsX509WithSsh',
  ],
  kerberos: ['kerberos', 'kerberosAlternate', 'kerberosCrossRealm'],
};

function generateConnections() {
  const connections = [];
  for (const [env, variants] of Object.entries(connectionsWithVariants)) {
    const envConnections = createTestEnvironments([env]);
    for (const variant of variants) {
      connections.push({
        id: v4(),
        favorite: {
          name: variant,
        },
        connectionOptions: envConnections.getConnectionOptions(variant),
      });
    }
  }
  return {
    type: 'Compass Connections',
    version: 1,
    connections,
  };
}

async function writeConnections() {
  const data = generateConnections();
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

/**
 * Creates a file with the connections for the Compass app,
 * based on the test environments. These connections can be
 * directly imported into Compass.
 */
void writeConnections();
