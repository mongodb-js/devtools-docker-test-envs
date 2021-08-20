import TestEnvironment from "./test-environment";

import community from "../docker/community/config";
import enterprise from "../docker/enterprise/config";
import kerberos from "../docker/kerberos/config";
import ldap from "../docker/ldap/config";
import replicaSet from "../docker/replica-set/config";
import scram from "../docker/scram/config";
import sharded from "../docker/sharded/config";
import ssh from "../docker/ssh/config";
import tls from "../docker/tls/config";

export default function createTestEnvironments(): Record<
  string,
  TestEnvironment
> {
  return {
    community: new TestEnvironment(community),
    enterprise: new TestEnvironment(enterprise),
    kerberos: new TestEnvironment(kerberos),
    ldap: new TestEnvironment(ldap),
    replicaSet: new TestEnvironment(replicaSet),
    scram: new TestEnvironment(scram),
    sharded: new TestEnvironment(sharded),
    ssh: new TestEnvironment(ssh),
    tls: new TestEnvironment(tls),
  };
}
