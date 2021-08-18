const assert = require('assert');
const execa = require('execa');

const TestEnvironment = require('./test-environment');
const config = require('./fixtures/config');

describe('TestEnvironment', function() {
  let testEnvironment;

  beforeEach(function() {
    testEnvironment = new TestEnvironment(config);
  });

  describe('start/stop', function() {
    it('starts and stops an environment', async function() {
      try {
        await testEnvironment.start();
        const { stdout } = await execa('docker', ['ps']);
        assert.ok(stdout.includes(testEnvironment.config.dockerCompose.projectName));
      } finally {
        await testEnvironment.stop();
        const { stdout } = await execa('docker', ['ps']);
        assert.ok(!stdout.includes(testEnvironment.config.dockerCompose.projectName));
      }
    });
  });

  describe('getConnectionOptions', function() {
    it('returns connection options for one connection', async function() {
      assert.deepStrictEqual(
        await testEnvironment.getConnectionOptions('community'),
        {
          'connectionString': 'mongodb://localhost:27099/test'
        }
      );
    });
  });
});