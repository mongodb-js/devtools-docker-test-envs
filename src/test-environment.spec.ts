import assert from "assert";
import execa from "execa";

import TestEnvironment from "./test-environment";
import config from "./fixtures/config";

describe("TestEnvironment", function () {
  let testEnvironment;

  beforeEach(function () {
    testEnvironment = new TestEnvironment(config);
  });

  describe("start/stop", function () {
    it("starts and stops an environment", async function () {
      try {
        await testEnvironment.start();
        const { stdout } = await execa("docker", ["ps"]);
        assert.ok(
          stdout.includes(testEnvironment.config.dockerCompose.projectName)
        );
      } finally {
        await testEnvironment.stop();
        const { stdout } = await execa("docker", ["ps"]);
        assert.ok(
          !stdout.includes(testEnvironment.config.dockerCompose.projectName)
        );
      }
    });
  });
});
