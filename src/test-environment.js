const uuid = require('uuid');
const execa = require('execa');
const waitOn = require('wait-on');
var hostile = require('hostile');
const util = require('util');

const setHostEntry = util.promisify(hostile.set.bind(hostile));
const removeHostEntry = util.promisify(hostile.remove.bind(hostile));

class TestEnvironment {
  constructor(config) {
    this.config = config;

    const dockerComposeYaml = config.dockerCompose.yamlPath;
    const dockerComposeProjectName = `${config.dockerCompose.projectName}-${uuid.v4()}`;
    this._commonDockerComposeArgs = [
      '-p', dockerComposeProjectName,
      '-f', dockerComposeYaml
    ];
  }

  async start() {
    const args = [
      ...this._commonDockerComposeArgs,
      'up', '-d', '--force-recreate', '--remove-orphans'
    ];

    for (const host of this.config.hosts || []) {
      await setHostEntry('127.0.0.1', host);
    }

    await execa('docker-compose', args, {
      cwd: this.clonePath, stdio: 'inherit'
    });

    await waitOn({
      resources: this.config.waitOn || [],
      timeout: 5 * 60000 // 5 minutes
    });

    if (this.config.setup) {
      await this.config.setup();
    }
  }

  async stop() {
    try {
      for (const host of this.config.hosts || []) {
        await removeHostEntry('127.0.0.1', host);
      }
    } catch (error) {
      console.error('failed to remove host entries, skipping. Caused by:', error);
    }

    try {
      await (this.config.teardown || (() => {}))();
    } catch (error) {
      console.error('failed config teardown, skipping. Caused by:', error);
    }

    await execa('docker-compose', [
      ...this._commonDockerComposeArgs,
      'down', '-v', '--remove-orphans'
    ], { cwd: this.clonePath });
  }

  async getConnectionOptions(id) {
    return this.config.connections[id];
  }
}

module.exports = TestEnvironment;
