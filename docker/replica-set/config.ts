import path from 'path';

export default {
  dockerCompose: {
    projectName: path.basename(__dirname),
    yamlPath: path.resolve(__dirname, 'docker-compose.yaml'),
  },
  waitOn: ['tcp:28001', 'tcp:28002', 'tcp:28003', 'tcp:28004'],
  hosts: ['mongodb-rs-1', 'mongodb-rs-2', 'mongodb-rs-3'],
  connections: {
    replicaSet: {
      connectionString:
        'mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset',
    },
    replicaSetAnaylticsNode: {
      connectionString:
        'mongodb://root:password123@mongodb-rs-1:28001,mongodb-rs-2:28002,mongodb-rs-3:28003/db1?authSource=admin&replicaSet=replicaset&readPreference=secondary&readPreferenceTags=nodeType:ANALYTICS',
    },
    replicaSetPrivateNode: {
      connectionString:
        'mongodb://root:password123@localhost:28004/db1?authSource=admin',
    },
  },
};
