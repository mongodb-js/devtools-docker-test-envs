#!/bin/bash
KADMIN_PRINCIPAL_FULL=$KADMIN_PRINCIPAL@$REALM

echo "==================================================================================="
echo "==== Create the principals in the acl ============================================="
echo "==================================================================================="
echo "Adding $KADMIN_PRINCIPAL principal"
kadmin.local -q "delete_principal -force $KADMIN_PRINCIPAL_FULL"
echo ""
kadmin.local -q "addprinc -pw $KADMIN_PASSWORD $KADMIN_PRINCIPAL_FULL"
echo ""

if [[ "x${TRUST_PRINCIPAL}" != "x" && "x${TRUST_REALM}" != "x" ]]; then
  echo "Adding cross-realm principal"
  kadmin.local -q "delete_principal -force ${TRUST_PRINCIPAL}@${TRUST_REALM}"
  echo ""
  kadmin.local -q "addprinc -pw crosspassword ${TRUST_PRINCIPAL}@${TRUST_REALM}"
  echo ""
fi

kadmin.local -q "delete_principal -force mongodb/mongodb-kerberos-3.examplewrong.com@$REALM"
kadmin.local -q "addprinc -randkey mongodb/mongodb-kerberos-3.examplewrong.com@$REALM"

kadmin.local -q "ktadd -k /mongodb.keytab mongodb/mongodb-kerberos-3.examplewrong.com@$REALM"
