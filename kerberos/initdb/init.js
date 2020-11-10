/* eslint-disable no-undef */

db.auth('root', 'root');

db = db.getSiblingDB('$external');

db.createUser(
  {
    user: "encoded!user@EXAMPLE.COM",
    roles: [ { role: "readWriteAnyDatabase", db: "admin" } ]
  }
)

db.createUser(
  {
    user: "mongodb.user@EXAMPLE.COM",
    roles: [ { role: "readWriteAnyDatabase", db: "admin" } ]
  }
)

db.createUser(
  {
     user: "application/reporting@EXAMPLE.COM",
     roles: [
       { role: "read", db: "db1" },
       { role: "readWrite", db: "db2" },
       { role: "dbAdmin", db: "db3" },
       { role: "dbOwner", db: "db4" }
     ]
  }
)
