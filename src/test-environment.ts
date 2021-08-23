import { TestEnvironmentConfiguration } from "./test-environment-configuration";

const uuid = require("uuid");
const execa = require("execa");
const waitOn = require("wait-on");
const hostile = require("hostile");
const util = require("util");
const path = require("path");

const setHostEntry = util.promisify(hostile.set.bind(hostile));
const removeHostEntry = util.promisify(hostile.remove.bind(hostile));

export default class TestEnvironment {
  config: TestEnvironmentConfiguration;
  private _dockerComposeArgs: string[];
  private _dockerComposeCwd: string;

  constructor(config: TestEnvironmentConfiguration) {
    this.config = config;

    const dockerComposeYaml = config.dockerCompose.yamlPath;
    const dockerComposeProjectName = `${
      config.dockerCompose.projectName
    }-${uuid.v4()}`;

    this._dockerComposeArgs = [
      "-p",
      dockerComposeProjectName,
      "-f",
      path.basename(dockerComposeYaml),
    ];

    this._dockerComposeCwd = path.dirname(dockerComposeYaml);
  }

  async start() {
    const args = [
      ...this._dockerComposeArgs,
      "up",
      "-d",
      "--force-recreate",
      "--remove-orphans",
    ];

    for (const host of this.config.hosts || []) {
      await setHostEntry("127.0.0.1", host);
    }

    await execa("docker-compose", args, {
      cwd: this._dockerComposeCwd,
      stdio: "inherit",
    });

    await waitOn({
      resources: this.config.waitOn || [],
      timeout: 5 * 60000, // 5 minutes
    });

    if (this.config.setup) {
      await this.config.setup();
    }
  }

  async stop() {
    try {
      for (const host of this.config.hosts || []) {
        await removeHostEntry("127.0.0.1", host);
      }
    } catch (error) {
      console.error(
        "failed to remove host entries, skipping. Caused by:",
        error
      );
    }

    try {
      await (this.config.teardown || (() => {}))();
    } catch (error) {
      console.error("failed config teardown, skipping. Caused by:", error);
    }

    await execa(
      "docker-compose",
      [...this._dockerComposeArgs, "down", "-v", "--remove-orphans"],
      { cwd: this._dockerComposeCwd }
    );
  }
}
