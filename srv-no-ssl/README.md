
### Srv no ssl

1. disable the Umbrella roaming client, on mac os it can be done with:

``` sh
sudo launchctl unload /Library/LaunchDaemons/com.opendns.osx.RoamingClientConfigUpdater.plist
```

You can re-enable afterwards with:

``` sh
sudo launchctl load /Library/LaunchDaemons/com.opendns.osx.RoamingClientConfigUpdater.p
```

2. Start replica set and dnsmasq:

``` sh
docker-compose -f replica-set/docker-compose.yaml up
docker-compose -f dsnmasq/docker-compose.yaml up
```

3. Add an host entry to `/etc/hosts`

``` sh
127.0.0.1 srv-test.mongodb.dev
```

4. Set your dns to 127.0.0.1 so it uses dsnmasq.

#### How to connect

``` sh
mongodb+srv://root:password123@srv-test.mongodb.dev/db1?ssl=false
```
