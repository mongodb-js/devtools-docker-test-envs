const uuid = require('uuid');
const execa = require('execa');
const waitOn = require('wait-on');

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
    console.log('starting', this.name);
    const args = [
      ...this._commonDockerComposeArgs,
      'up', '-d', '--force-recreate', '--remove-orphans'
    ];

    console.log(args);

    await execa('docker-compose', args, {
      cwd: this.clonePath, stdio: 'inherit'
    });

    waitOn({
      resources: this.config.waitOn || [],
      timeout: 60000
    });
  }

  async stop() {
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
