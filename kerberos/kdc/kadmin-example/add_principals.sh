#!/bin/bash

echo "==================================================================================="
echo "==== Create the principals in the acl ============================================="
echo "==================================================================================="
echo "Adding $KADMIN_PRINCIPAL principal"
kadmin.local -q "delete_principal -force $KADMIN_PRINCIPAL_FULL"
echo ""
kadmin.local -q "addprinc -pw $KADMIN_PASSWORD $KADMIN_PRINCIPAL_FULL"
echo ""

echo "Adding noPermissions principal"
kadmin.local -q "delete_principal -force noPermissions@$REALM"
echo ""
kadmin.local -q "addprinc -pw $KADMIN_PASSWORD noPermissions@$REALM"
echo ""

echo "Adding mongodb.user principal"
kadmin.local -q "delete_principal -force mongodb.user@$REALM"
echo ""
kadmin.local -q "addprinc -pw password mongodb.user@$REALM"
echo ""

echo "Adding encoded!user principal"
kadmin.local -q "delete_principal -force encoded!user@$REALM"
echo ""
kadmin.local -q "addprinc -pw password encoded!user@$REALM"
echo ""

echo "Adding application/reporting principal"
kadmin.local -q "delete_principal -force application/reporting@$REALM"
echo ""
kadmin.local -q "addprinc -pw password application/reporting@$REALM"
echo ""

if [[ "x${TRUST_PRINCIPAL}" != "x" && "x${TRUST_REALM}" != "x" ]]; then
  echo "Adding cross-realm principal"
  kadmin.local -q "delete_principal -force ${TRUST_PRINCIPAL}@${TRUST_REALM}"
  echo ""
  kadmin.local -q "addprinc -pw crosspassword ${TRUST_PRINCIPAL}@${TRUST_REALM}"
  echo ""
fi

kadmin.local -q "delete_principal -force mongodb/mongodb-kerberos-1.example.com@$REALM"
kadmin.local -q "addprinc -randkey mongodb/mongodb-kerberos-1.example.com@$REALM"

kadmin.local -q "delete_principal -force alternate/mongodb-kerberos-2.example.com@$REALM"
kadmin.local -q "addprinc -randkey alternate/mongodb-kerberos-2.example.com@$REALM"

kadmin.local -q "ktadd -k /mongodb.keytab mongodb/mongodb-kerberos-1.example.com@$REALM"
kadmin.local -q "ktadd -k /mongodb.keytab alternate/mongodb-kerberos-2.example.com@$REALM"