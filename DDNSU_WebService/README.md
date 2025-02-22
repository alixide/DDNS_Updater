# DDNSU WebService
This document described the key parts of the DDNSU WebService. To better follow the json structure here are some keywords:
Definitions:
 - Dynamic Domain: A domain name that is updated with a new IP address when the IP address changes.
 - Dynamic Domain Name Service (DDNS): A service that provides dynamic domain names.
 - DDNSs: A list of dynamic domain name service providers.
 - Host: A host with a dynamic IP which can contain several dynamic domains sharing the same IP address.

To initialize the DDNSU WebService a config.json file shall be created with the following path "./data/config.json". Remember to update the values and remove the comments before using this template.

```json
{
  "ddnss": [
    {
      "name": "ddns1",
      "updateUrl": "http://www.ddns-1.com/update?...",
      "settings": null
    },
    {
      "name": "ddns2",
      "updateUrl": "http://www.ddns-2.com/update?...",
      "settings": null
    }
  ],
  "hosts": {
    "e31d41bedbe94f74abf56e0c558f25d3": {
      "name": "host1",
      "lastIp": null,
      "lastUpdate": 0,
      "domains": {
        "domain-1.com": {
          "ddns": 0,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        },
        "domain-2.com": {
          "ddns": 0,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        }
      }
    },
    "d94d69713f6142e287a9d392e15258c1": {
      "name": "host2",
      "lastIp": null,
      "lastUpdate": 0,
      "domains": {
        "domain-3.com": {
          "ddns": 0,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        },
        "domain-4.com": {
          "ddns": 1,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        }
      }
    }
  }
}
```

The config.json file shall include the following components:
 - ddnss: list of dynamic domain name service providers, custom settings for GET call and also their update url template including the following placeholders: `<user>`, `<pass>`, `<domain>`, and `<ip>`. Each ddns entry in the list conains the following info:
   - name: The name of the DDNS service provider.
   - updateUrl: The URL to update the IP address of the domain.
   - settings: Custom settings for the GET call.
 - hosts: list of hosts, each is a variable with a lowercase GUID without dash and contains the following info:
   - name: The name of the host group.
   - lastIp: The last IP address that was updated. Leave this null.
   - lastUpdate: The last time the IP address was updated. Leave this 0.
   - domains: list of domains that belong to the host group, each domain is a variable with the name of the domain as key and contains the following info:
     - ddns: The index of the DDNS service provider in the ddnss list.
     - updateUrl: The URL to update the IP address of the domain, used if there is a custom update URL for the domain otherwise leave it null.
     - authorization: The user and password to authenticate the update call. The authorization include the following fields:
       - user: The username to authenticate the update call.
       - pass: The password to authenticate the update call.

In order to update a host IP the host shall make a call with the following format providing dynamic host id (dhid) and the ip:
`http://localhost:8080/api/update?dhid=e31d41bedbe94f74abf56e0c558f25d3&ip=1.1.1.1`

## API Documentation
This section documents the API endpoints of the DDNSU WebService.

### Update IP of a Host
#### Update IP
This endpoint updates the IP address of a host.
- Method: GET
- URL: `/api/update?host=<host>&ip=<ip>`
- Parameters:
  - host: The dynamic host id.
  - ip: The new IP address of the host.

### User Management
This section documents the user management endpoints of the DDNSU WebService.
#### Login
This endpoint logs in a user.
- Method: GET
- URL: `/api/login?secret=<secret>`
- Parameters:
  - secret: The MD5 hashed password of the user.
#### Logout
This endpoint logs out a user.
- Method: GET
- URL: `/api/logout?session=<session>`
- Parameters:
  - session: The session id of the user.
#### Change Password
This endpoint changes the password of a user.
- Method: GET
- URL: `/api/secret/change?session=<session>&oldSecret=<oldSecret>&newSecret=<newSecret>`
- Parameters:
  - session: The session id of the user.
  - oldSecret: The MD5 hashed old password of the user.
  - newSecret: The MD5 hashed new password of the user.

### DDNS Management
This section documents the DDNS management endpoints of the DDNSU WebService.
#### Add a DDNS
This endpoint adds a DDNS service provider.
- Method: GET
- URL: `/api/ddns/add?session=<session>&name=<name>&updateUrl=<updateUrl>&settings=<settings>`
- Parameters:
  - session: The session id of the user.
  - name: The name of the DDNS service provider.
  - updateUrl: The URL to update the IP address of the domain.
  - settings: Custom settings for the GET call.
#### Get a DDNS
This endpoint gets a DDNS service provider.
- Method: GET
- URL: `/api/ddns/<ddns>?session=<session>`
- Parameters:
  - ddns: The index of the DDNS service provider in the ddnss list.
  - session: The session id of the user.
#### Update a DDNS
This endpoint updates a DDNS service provider.
- Method: GET
- URL: `/api/ddns/<ddns>/update?session=<session>&name=<name>&updateUrl=<updateUrl>&settings=<settings>`
- Parameters:
  - ddns: The index of the DDNS service provider in the ddnss list.
  - session: The session id of the user.
  - name: The name of the DDNS service provider.
  - updateUrl: The URL to update the IP address of the domain.
  - settings: Custom settings for the GET call.
#### Delete a DDNS
This endpoint deletes a DDNS service provider.
- Method: GET
- URL: `/api/ddns/<ddns>/delete?session=<session>`
- Parameters:
  - ddns: The index of the DDNS service provider in the ddnss list.
  - session: The session id of the user.

### Host Management
This section documents the host management endpoints of the DDNSU WebService.
#### Add a Host
This endpoint adds a host.
- Method: GET
- URL: `/api/host/add?session=<session>&name=<name>&ip=<ip>`
- Parameters:
  - session: The session id of the user.
  - name: The name of the host group.
  - ip: The IP address of the host.
#### Get a Host
This endpoint gets a host.
- Method: GET
- URL: `/api/host/<host>?session=<session>`
- Parameters:
  - host: The dynamic host id.
  - session: The session id of the user.
#### Update a Host
This endpoint updates a host.
- Method: GET
- URL: `/api/host/<host>/update?session=<session>&name=<name>&ip=<ip>`
- Parameters:
  - host: The dynamic host id.
  - session: The session id of the user.
  - name: The name of the host group.
  - ip: The IP address of the host.
#### Delete a Host
This endpoint deletes a host.
- Method: GET
- URL: `/api/host/<host>/delete?session=<session>`
- Parameters:
  - host: The dynamic host id.
  - session: The session id of the user.

### Domain Management
This section documents the domain management endpoints of the DDNSU WebService.
#### Add a Domain
This endpoint adds a domain to a host.
- Method: GET
- URL: `/api/host/<host>/domain/add?session=<session>&domain=<domain>&ddns=<ddns>&updateUrl=<updateUrl>&user=<user>&pass=<pass>`
- Parameters:
  - host: The dynamic host id.
  - session: The session id of the user.
  - domain: The name of the domain.
  - ddns: The index of the DDNS service provider in the ddnss list.
  - updateUrl: The URL to update the IP address of the domain.
  - user: The username to authenticate the update call.
  - pass: The password to authenticate the update call.
#### Get a Domain
This endpoint gets a domain of a host.
- Method: GET
- URL: `/api/host/<host>/domain/<domain>?session=<session>`
- Parameters:
  - host: The dynamic host id.
  - domain: The name of the domain.
  - session: The session id of the user.
#### Update a Domain
This endpoint updates a domain of a host.
- Method: GET
- URL: `/api/host/<host>/domain/<domain>/update?session=<session>&ddns=<ddns>&updateUrl=<updateUrl>&user=<user>&pass=<pass>`
- Parameters:
  - host: The dynamic host id.
  - domain: The name of the domain.
  - session: The session id of the user.
  - ddns: The index of the DDNS service provider in the ddnss list.
  - updateUrl: The URL to update the IP address of the domain.
  - user: The username to authenticate the update call.
  - pass: The password to authenticate the update call.
#### Delete a Domain
This endpoint deletes a domain of a host.
- Method: GET
- URL: `/api/host/<host>/domain/<domain>/delete?session=<session>`
- Parameters:
  - host: The dynamic host id.
  - domain: The name of the domain.
  - session: The session id of the user.