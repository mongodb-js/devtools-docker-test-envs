/* eslint-disable no-undef */

db.auth('root', 'root');

db.getSiblingDB('admin').createRole({
  role: 'cn=readWriteAnyDatabase,ou=dbRoles,dc=example,dc=com',
  privileges: [],
  roles: ['readWriteAnyDatabase'],
});

db.getSiblingDB('$external').createUser({
  user: 'writer@EXAMPLE.COM',
  roles: [{ role: 'readWriteAnyDatabase', db: 'admin' }],
});
