const TestEnvironment = require('./src/test-environment');

module.exports = {
  community: new TestEnvironment(require('./docker/community'))
};