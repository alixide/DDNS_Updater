# DDNSU WebService
This document described the key parts of the DDNSU WebService. To better follow the json structure here are some keywords:
Definitions:
 - Dynamic Domain: A domain name that is updated with a new IP address when the IP address changes.
 - Dynamic Domain Name Service (DDNS): A service that provides dynamic domain names.
 - DDNSs: A list of dynamic domain name service providers.
 - Host Group: A group of dynamic domains that share the same IP address.

To initialize the DDNSU WebService a data.json file shall be created with the following path "./data/data.json". Remember to update the values and remove the comments before using this template.

```json
{
  "ddnss": [
    {
      "name": "DDNS1",
      "updateUrl": "http://www.ddns-1.com/update?...",
      "settings": null
    },
    {
      "name": "DDNS2",
      "updateUrl": "http://www.ddns-2.com/update?...",
      "settings": null
    }
  ],
  "dynamicHosts": {
    "e31d41bedbe94f74abf56e0c558f25d3": {
      "name": "HostGroup1",
      "lastIp": null,
      "domains": {
        "domain-1.com": {
          "ddns": 1,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        },
        "domain-2.com": {
          "ddns": 1,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        }
      }
    },
    "d94d69713f6142e287a9d392e15258c1": {
      "name": "HostGroup2",
      "lastIp": null,
      "domains": {
        "domain-3.com": {
          "ddns": 1,
          "updateUrl": null,
          "authorization": {
            "user": "username",
            "pass": "password"
          }
        },
        "domain-4.com": {
          "ddns": 2,
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

The data.json file shall include the following components:
 - ddnss: list of dynamic domain name service providers, custom settings for GET call and also their update url template including the following placeholders: `<user>`, `<pass>`, `<domain>`, and `<ip>`. Each ddns entry in the list conains the following info:
   - name: The name of the DDNS service provider.
   - updateUrl: The URL to update the IP address of the domain.
   - settings: Custom settings for the GET call.
 - dynamicHosts: list of host groups, each host group is a variable with a lowercase GUID without dash and contains the following info:
   - name: The name of the host group.
   - lastIp: The last IP address that was updated. Leave this null.
   - domains: list of domains that belong to the host group, each domain is a variable with the name of the domain as key and contains the following info:
     - ddns: The index of the DDNS service provider in the ddnss list.
     - updateUrl: The URL to update the IP address of the domain, used if there is a custom update URL for the domain otherwise leave it null.
     - authorization: The user and password to authenticate the update call. The authorization include the following fields:
       - user: The username to authenticate the update call.
       - pass: The password to authenticate the update call.