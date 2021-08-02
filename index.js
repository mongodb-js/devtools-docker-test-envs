const path = require('path');
const glob = require('glob');

const configs = glob.sync('**/docker-compose.{yaml,yml}', {
  cwd: __dirname,
  ignore: 'node_modules'
});

module.exports = Object.fromEntries(
  configs.map((configPath) => [
    path.dirname(configPath),
    path.join(__dirname, configPath)
  ])
);
