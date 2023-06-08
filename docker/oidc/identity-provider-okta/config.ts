import path from 'path';

import ConnectionString from 'mongodb-connection-string-url';

const port = '27095';

const connectionString = new ConnectionString(`mongodb://localhost:${port}`);
connectionString.searchParams.set('authMechanism', 'MONGODB-OIDC');

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: [`tcp:${port}`],
  connections: {
    oidc: {
      connectionString: connectionString.href,
    },
  },
};
