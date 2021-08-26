import TestEnvironment from './test-environment';
import { ConnectionOptions } from './test-environment-configuration';

export default class TestEnvironments {
  private _envs: Record<string, TestEnvironment>;
  private _connections: Record<string, ConnectionOptions>;
  constructor(environments: Record<string, TestEnvironment>) {
    this._envs = environments;
    this._connections = {};
    for (const env of Object.values(environments)) {
      this._connections = {
        ...this._connections,
        ...env.config.connections,
      };
    }
  }

  getConnectionOptions(id: string): ConnectionOptions {
    const connectionOptions = this._connections[id];

    if (!connectionOptions) {
      throw new Error(`Missing connection options with id ${id}`);
    }

    return connectionOptions;
  }

  async setup(): Promise<void> {
    await Promise.all(Object.values(this._envs).map((env) => env.start()));
  }

  async teardown(): Promise<void> {
    await Promise.all(Object.values(this._envs).map((env) => env.stop()));
  }
}
