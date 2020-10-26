### LDAP

``` sh
docker-compose -f ldap/docker-compose.yaml up
```

#### How to connect

``` sh
# With enterprise shell:
mongo \
  --host localhost \
  --port 30017 \
  --username 'writer@EXAMPLE.COM' \
  --password 'Password1!' \
  --authenticationMechanism PLAIN \
  --authenticationDatabase '$external'
```
