const path = require('path');

module.exports = {
  community: {
    config: path.join(__dirname, 'community', 'docker-compose.yaml'),
    connectionOptions: [{ port: 27020 }]
  },
  enterprise: {
    config: path.join(__dirname, 'enterprise', 'docker-compose.yaml'),
    connectionOptions: [{ port: 27021 }]
  },
  kerberos: {
    config: path.join(__dirname, 'kerberos', 'docker-compose.yaml'),
    connectionOptions: [
      {
        host: 'mongodb-kerberos-1.example.com',
        port: 29017,
        authenticationMechanism: 'GSSAPI',
        authenticationDatabase: '$external',
        username: 'mongodb.user@EXAMPLE.COM'
      },
      {
        host: 'mongodb-kerberos-2.example.com',
        port: 29018,
        authenticationMechanism: 'GSSAPI',
        authenticationDatabase: '$external',
        gssapiServiceName: 'alternate',
        username: 'mongodb.user@EXAMPLE.COM'
      }
    ]
  },
  ldap: {
    config: path.join(__dirname, 'ldap', 'docker-compose.yaml'),
    connectionOptions: [
      {
        port: 30017,
        authenticationMechanism: 'PLAIN',
        authenticationDatabase: '$external',
        username: 'writer@EXAMPLE.COM',
        password: 'Password1!'
      }
    ]
  },
  replica_set: {
    config: path.join(__dirname, 'replica-set', 'docker-compose.yaml'),
    connectionOptions: [
      {
        host: 'mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003',
        username: 'root',
        password: 'password123',
        replicaSet: 'replicaset'
      },
      {
        port: 28004,
        username: 'root',
        password: 'password123',
        replicaSet: 'replicaset'
      }
    ]
  },
  scram: {
    config: path.join(__dirname, 'scram', 'docker-compose.yaml'),
    connectionOptions: [
      {
        port: 28006,

        username: 'user1',
        password: 'password'
      },
      {
        port: 28006,
        username: 'randomPassword',
        password: 'C;Ib86n5b8{AnExew[TU%XZy,)E6G!dk'
      },
      {
        port: 28006,
        username: 'scramSha1',
        password: 'password'
      },
      {
        port: 28006,
        authenticationMechanism: 'SCRAM-SHA-256',
        username: 'scramSha256',
        password: 'password'
      },
      {
        port: 28006,
        username: 'user2',
        password: 'password'
      },
      {
        port: 28006,
        username: 'customRole',
        password: 'password'
      },
      {
        port: 28006,
        authenticationDatabase: 'authDb',
        username: 'authDb',
        password: 'password'
      }
    ]
  },
  sharded: {
    config: path.join(__dirname, 'sharded', 'docker-compose.yaml'),
    connectionOptions: [
      {
        port: 28004,
        username: 'root',
        password: 'password123'
      }
    ]
  },
  ssh: {
    config: path.join(__dirname, 'ssh', 'docker-compose.yaml'),
    connectionOptions: [
      {
        host: 'mongo',
        port: 27017,
        sshTunnelHostname: 'localhost',
        sshTunnelPort: 22222,
        sshTunnelUsername: 'root',
        sshTunnelPassword: 'password'
      },
      {
        host: 'mongodb-rs-ssh-2',
        port: 28002,
        sshTunnelHostname: 'localhost',
        sshTunnelPort: 22222,
        sshTunnelUsername: 'root',
        sshTunnelPassword: 'password'
      },
      {
        host: 'mongo',
        port: 27017,
        sshTunnelHostname: 'localhost',
        sshTunnelPort: 22222,
        sshTunnelUsername: 'root',
        sshTunnelIdentityFile: path.join(
          __dirname,
          'ssh',
          'keys',
          'key-without-passphrase'
        )
      },
      {
        host: 'mongo',
        port: 27017,
        sshTunnelHostname: 'localhost',
        sshTunnelPort: 22222,
        sshTunnelUsername: 'root',
        sshTunnelIdentityFile: path.join(
          __dirname,
          'ssh',
          'keys',
          'key-with-passphrase'
        ),
        sshTunnelPassphrase: 'passphrase'
      }
    ]
  },
  tls: {
    config: path.join(__dirname, 'tls', 'docker-compose.yaml'),
    connectionOptions: [
      {
        port: 27029,
        tlsAllowInvalidHostnames: true,
        sslValidate: false
      },
      {
        port: 27029,
        tlsCAFile: path.join(__dirname, 'tls', 'tls', 'ca.pem')
      },
      {
        port: 27030,
        tlsCAFile: path.join(__dirname, 'tls', 'tls', 'ca.pem'),
        tlsCertificateKeyFile: path.join(__dirname, 'tls', 'tls', 'client.pem')
      },
      {
        port: 27031,
        authenticationMechanism: 'MONGODB-X509',
        authenticationDatabase: '$external',
        tlsCAFile: path.join(__dirname, 'tls', 'tls', 'ca.pem'),
        tlsCertificateKeyFile: path.join(__dirname, 'tls', 'tls', 'client.pem')
      },
      {
        host: 'mongodb-tls-x509',
        port: 27017,
        authenticationMechanism: 'MONGODB-X509',
        authenticationDatabase: '$external',
        tlsCAFile: path.join(__dirname, 'tls', 'tls', 'ca.pem'),
        tlsCertificateKeyFile: path.join(__dirname, 'tls', 'tls', 'client.pem'),
        sshTunnelHostname: 'localhost',
        sshTunnelPort: 22223,
        sshTunnelUsername: 'root',
        sshTunnelPassword: 'password'
      }
    ]
  }
};
