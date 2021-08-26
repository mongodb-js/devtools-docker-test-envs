export interface TestEnvironmentConfiguration {
  dockerCompose: DockerComposeOptions;
  waitOn?: string[];
  hosts?: string[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  connections: Record<string, ConnectionOptions>;
}

interface DockerComposeOptions {
  projectName: string;
  yamlPath: string;
}

export interface ConnectionOptions {
  connectionString: string;
  sshTunnel?: ConnectionSshOptions;
}

interface ConnectionSshOptions {
  host: string;
  port: number;
  username: string;
  password?: string;
  identityKeyFile?: string;
  identityKeyPassphrase?: string;
}
