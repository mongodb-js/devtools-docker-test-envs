import path from 'path';

import ConnectionString from 'mongodb-connection-string-url';

const unvalidated = new ConnectionString('mongodb://localhost:27029');
unvalidated.searchParams.set('tls', 'true');
unvalidated.searchParams.set('tlsInsecure', 'true');

const serverValidation = new ConnectionString('mongodb://localhost:27029');
serverValidation.searchParams.set('tls', 'true');
serverValidation.searchParams.set(
  'tlsCAFile',
  path.resolve(__dirname, 'tls', 'ca.pem')
);

const serverValidationSsh = new ConnectionString(
  'mongodb://mongodb-tls-server-named:27017'
);
serverValidationSsh.searchParams.set('tls', 'true');
serverValidationSsh.searchParams.set(
  'tlsCAFile',
  path.resolve(__dirname, 'tls', 'ca.pem')
);

const serverAndClientValidation = new ConnectionString(
  'mongodb://localhost:27030'
);
serverAndClientValidation.searchParams.set('tls', 'true');
serverAndClientValidation.searchParams.set(
  'tlsCAFile',
  path.resolve(__dirname, 'tls', 'ca.pem')
);
serverAndClientValidation.searchParams.set(
  'tlsCertificateKeyFile',
  path.resolve(__dirname, 'tls', 'client.pem')
);

const serverAndClientValidationKeyCrt = new ConnectionString(
  'mongodb://localhost:27030'
);
serverAndClientValidationKeyCrt.searchParams.set('tls', 'true');
serverAndClientValidationKeyCrt.searchParams.set(
  'tlsCAFile',
  path.resolve(__dirname, 'tls', 'ca.pem')
);
serverAndClientValidationKeyCrt.searchParams.set(
  'tlsCertificateKeyFile',
  path.resolve(__dirname, 'tls', 'client.key')
);

serverAndClientValidationKeyCrt.searchParams.set(
  'tlsCertificateFile',
  path.resolve(__dirname, 'tls', 'client.crt')
);

const x509 = new ConnectionString('mongodb://localhost:27031');
x509.searchParams.set('tls', 'true');
x509.searchParams.set('tlsCAFile', path.resolve(__dirname, 'tls', 'ca.pem'));
x509.searchParams.set(
  'tlsCertificateKeyFile',
  path.resolve(__dirname, 'tls', 'client.pem')
);
x509.searchParams.set('authMechanism', 'MONGODB-X509');

const x509WithSsh = new ConnectionString('mongodb://mongodb-tls-x509:27017');
x509WithSsh.searchParams.set('tls', 'true');
x509WithSsh.searchParams.set('tlsAllowInvalidHostnames', 'true');
x509WithSsh.searchParams.set(
  'tlsCAFile',
  path.resolve(__dirname, 'tls', 'ca.pem')
);
x509WithSsh.searchParams.set(
  'tlsCertificateKeyFile',
  path.resolve(__dirname, 'tls', 'client.pem')
);
x509WithSsh.searchParams.set('authMechanism', 'MONGODB-X509');

const sshTunnel = {
  host: 'localhost',
  port: 22223,
  username: 'root',
  password: 'password',
};

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: ['tcp:27029', 'tcp:27030', 'tcp:27031', 'tcp:22223'],
  connections: {
    tlsUnvalidated: {
      connectionString: unvalidated.href,
    },
    tlsServerValidation: {
      connectionString: serverValidation.href,
    },
    tlsServerValidationSsh: {
      connectionString: serverValidationSsh.href,
      sshTunnel,
    },
    tlsServerAndClientValidation: {
      connectionString: serverAndClientValidation.href,
    },
    tlsServerAndClientValidationKeyCrt: {
      connectionString: serverAndClientValidationKeyCrt.href,
    },
    tlsX509: {
      connectionString: x509.href,
    },
    tlsX509WithSsh: {
      connectionString: x509WithSsh.href,
      sshTunnel,
    },
  },
};
