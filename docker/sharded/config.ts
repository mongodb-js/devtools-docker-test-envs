import path from 'path';

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: ['tcp:28004'],
  connections: {
    sharded: {
      connectionString:
        'mongodb://root:password123@localhost:28004/db1?authSource=admin',
    },
  },
};
