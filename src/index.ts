import TestEnvironment from './test-environment';
import TestEnvironments from './test-environments';
import { TestEnvironmentConfiguration } from './test-environment-configuration';

import community from '../docker/community/config';
import enterprise from '../docker/enterprise/config';
import kerberos from '../docker/kerberos/config';
import ldap from '../docker/ldap/config';
import replicaSet from '../docker/replica-set/config';
import scram from '../docker/scram/config';
import sharded from '../docker/sharded/config';
import ssh from '../docker/ssh/config';
import tls from '../docker/tls/config';
import oidc from '../docker/oidc/mock-oidc-provider/config';

const CONFIGS: Record<string, TestEnvironmentConfiguration> = {
  community,
  enterprise,
  kerberos,
  ldap,
  replicaSet,
  scram,
  sharded,
  ssh,
  tls,
  oidc,
};

export default function createTestEnvironments(
  filter: string[]
): TestEnvironments {
  const envs: Record<string, TestEnvironment> = {};
  for (const environmentName of filter) {
    envs[environmentName] = new TestEnvironment(CONFIGS[environmentName]);
  }

  return new TestEnvironments(envs);
}
