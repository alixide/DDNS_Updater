# DDNSU WebService
This document described the key parts of the DDNSU WebService.

To initialize the DDNSU WebService a data.json file shall be created with the following path "./data/data.json". Remember to update the values and remove the comments before using this template.

```json
{
  // list of dynamic domain name service providers, custom settings for GET call and also their update url template including the following placeholders: <user>, <pass>, <domain>, <ip>.
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